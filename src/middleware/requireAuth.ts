import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

//protecting routes - requiring only logged in users to execute selecive ones
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.userId || !req.session.userRole) {
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
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
