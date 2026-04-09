import { Router } from "express";
import {
  validateLoginBody,
  validateRegisterBody,
} from "../middleware/authValidation.js";
import { registerUserSchema, loginUserSchema } from "../schemas/authSchema.js";
import {
  registerUserController,
  loginUserController,
} from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRegisterBody(registerUserSchema),
  registerUserController
); //have validation for req.body and then another service logic that checks if details are fine to create

authRouter.post(
  "/login",
  validateLoginBody(loginUserSchema),
  loginUserController
);
