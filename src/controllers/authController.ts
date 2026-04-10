import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/authService.js";
import { prisma } from "../lib/prisma.js";

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
    const userID = await loginUser(req.body);
    req.session.userId = userID;
    return res.status(200).json({
      success: true,
      message: "Login successful",
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

export function logoutUserController(req: Request, res: Response) {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
}

export function meController(req: Request, res: Response) {
  if (!req.session.userId) {
    return res.status(401).json({ authenticated: false });
  }
  return res.json({
    authenticated: Boolean(req.session.id),
    sessionID: req.session.id ?? null,
    userID: req.session.userId ?? null,
  });
}

//protecting routes - requiring only logged in users to execute selecive ones
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorised acess" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
  });

  if (!user) {
    return res.status(401).json({ message: "Unauthorised acess" });
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  next();
};
