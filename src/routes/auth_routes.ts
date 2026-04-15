import { Router } from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
  //limit to 5 requests per 15 minutes
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});
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
  limiter,
  validateLoginBody(loginUserSchema),
  loginUserController
);

authRouter.get("/checkme", meController);

authRouter.post("/logout", logoutUserController);
