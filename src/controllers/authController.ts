import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService.js";

export async function registerUserController(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    return res.status(200).json({
      success: true,
      message: "User created",
      data: {
        id: result.id,
        email: result.email,
        name: result.name,
        createdAt: result.createdAt,
      },
    });
  } catch (error: any) {
    if (error.message === "DUPLICATE_EMAIL") {
      return res.status(409).json({
        success: false,
        message: "Email exists in the system",
      });
    }
    if (error.message === "EMPTY_PASSWORD") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function loginUserController(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json({
      success: true,
      message: "Login success",
    });
  } catch (error: any) {
    if (error.message === "INVALID") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
