import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import AllUsers from "../models/userModel.js";
import {
  validateChangePasswordInput,
  validateLoginInput,
  validateRegisterInput,
} from "../validators/auth.validator.js";

const PASSWORD_KEY_LENGTH = 64;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, storedPassword: string): boolean {
  if (!storedPassword.includes(":")) {
    return storedPassword === password;
  }

  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH);
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
}

function sanitizeUser(userDocument: { toObject(): Record<string, unknown> }): Record<string, unknown> {
  const user = userDocument.toObject();
  delete user.password;
  delete user.__v;
  return user;
}

function sendServerError(res: Response, error: unknown, fallbackMessage: string): Response {
  const message = error instanceof Error ? error.message : fallbackMessage;
  return res.status(500).json({
    success: false,
    message,
  });
}

export async function registerUser(req: Request, res: Response): Promise<Response> {
  const validation = validateRegisterInput(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const { username, email, password, phoneNumber, address, avatar } = validation.data;

  try {
    const [existingEmail, existingPhoneNumber] = await Promise.all([
      AllUsers.findOne({ email }).lean(),
      AllUsers.findOne({ phoneNumber }).lean(),
    ]);

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    if (existingPhoneNumber) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already in use.",
      });
    }

    const user = await AllUsers.create({
      username,
      email,
      password: hashPassword(password),
      phoneNumber,
      address,
      avatar,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to create user.");
  }
}

export async function loginUser(req: Request, res: Response): Promise<Response> {
  const validation = validateLoginInput(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const { email, password } = validation.data;

  try {
    const user = await AllUsers.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This account is blocked.",
      });
    }

    const passwordMatches = verifyPassword(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.password.includes(":")) {
      user.password = hashPassword(password);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to login.");
  }
}

export async function changePassword(req: Request, res: Response): Promise<Response> {
  const validation = validateChangePasswordInput(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const { email, userId, currentPassword, newPassword } = validation.data;

  if (userId && !mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: "The supplied userId is invalid.",
    });
  }

  try {
    const user = await AllUsers.findOne(userId ? { _id: userId } : { email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatches = verifyPassword(currentPassword, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to change password.");
  }
}
