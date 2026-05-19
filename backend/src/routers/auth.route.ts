import { Router } from "express";
import {
  changePassword,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.patch("/change-password", changePassword);

export default authRouter;
