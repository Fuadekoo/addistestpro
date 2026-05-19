type ValidationErrors = Record<string, string>;

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationErrors };

export type RegisterUserInput = {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  avatar?: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type ChangePasswordInput = {
  email?: string;
  userId?: string;
  currentPassword: string;
  newPassword: string;
};

function getBody(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }

  return {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(value: unknown): string | undefined {
  const normalizedValue = getString(value);
  return normalizedValue ? normalizedValue : undefined;
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

function isStrongPassword(password: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function validateRegisterInput(payload: unknown): ValidationResult<RegisterUserInput> {
  const body = getBody(payload);
  const username = getString(body.username);
  const email = getString(body.email).toLowerCase();
  const password = getString(body.password);
  const confirmPassword = getOptionalString(body.confirmPassword);
  const phoneNumber = getString(body.phoneNumber);
  const address = getString(body.address);
  const avatar = getOptionalString(body.avatar);
  const errors: ValidationErrors = {};

  if (!username) {
    errors.username = "Username is required.";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters long.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Email format is invalid.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password = "Password must be at least 8 characters and include letters and numbers.";
  }

  if (confirmPassword && confirmPassword !== password) {
    errors.confirmPassword = "Confirm password must match the password.";
  }

  if (!phoneNumber) {
    errors.phoneNumber = "Phone number is required.";
  } else if (phoneNumber.length < 7) {
    errors.phoneNumber = "Phone number must be at least 7 characters long.";
  }

  if (!address) {
    errors.address = "Address is required.";
  } else if (address.length < 3) {
    errors.address = "Address must be at least 3 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      username,
      email,
      password,
      phoneNumber,
      address,
      avatar,
    },
  };
}

export function validateLoginInput(payload: unknown): ValidationResult<LoginUserInput> {
  const body = getBody(payload);
  const email = getString(body.email).toLowerCase();
  const password = getString(body.password);
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Email format is invalid.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email,
      password,
    },
  };
}

export function validateChangePasswordInput(payload: unknown): ValidationResult<ChangePasswordInput> {
  const body = getBody(payload);
  const email = getOptionalString(body.email)?.toLowerCase();
  const userId = getOptionalString(body.userId);
  const currentPassword = getString(body.currentPassword);
  const newPassword = getString(body.newPassword);
  const confirmNewPassword = getOptionalString(body.confirmNewPassword);
  const errors: ValidationErrors = {};

  if (!email && !userId) {
    errors.account = "Email or userId is required.";
  }

  if (email && !isValidEmail(email)) {
    errors.email = "Email format is invalid.";
  }

  if (!currentPassword) {
    errors.currentPassword = "Current password is required.";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required.";
  } else if (!isStrongPassword(newPassword)) {
    errors.newPassword = "New password must be at least 8 characters and include letters and numbers.";
  } else if (newPassword === currentPassword) {
    errors.newPassword = "New password must be different from the current password.";
  }

  if (confirmNewPassword && confirmNewPassword !== newPassword) {
    errors.confirmNewPassword = "Confirm new password must match the new password.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email,
      userId,
      currentPassword,
      newPassword,
    },
  };
}
