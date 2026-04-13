import "express-session";
import type { AuthenticatedUser } from "./auth.ts";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
