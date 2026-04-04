//validation logic
import { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export function validateCreateTicket<T>(schema: ZodType<T>) {
  //<T> whatever type the schema produces
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data; //assign to a safely parsed version - zod returns data
    next(); //continuing the request/pipeline
  };
}

export function validateUpdateTicket<T>(schema: ZodType<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}
