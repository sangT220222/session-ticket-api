import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateRegisterBody<T>(schema: ZodType<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Details did not meet the requirement",
        error: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data; //assign to a safe parsed result
    next();
  };
}

export function validateLoginBody<T>(schema: ZodType<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Details did not meet the requirement",
        error: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data; //assign to a safe parsed result
    next();
  };
}
