import { Router } from "express";
import {
  validateLoginBody,
  validateRegisterBody,
} from "../middleware/authValidation.js";
import { registerUserSchema, loginUserSchema } from "../schemas/authSchema.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  meController,
} from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRegisterBody(registerUserSchema),
  registerUserController
);

authRouter.post(
  "/login",
  validateLoginBody(loginUserSchema),
  loginUserController
);

authRouter.get("/checkme", meController);

authRouter.post("/logout", logoutUserController);
