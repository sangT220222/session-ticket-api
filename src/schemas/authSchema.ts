import * as z from "zod";

export const registerUserSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters long"),
    name: z.string().min(1).optional(),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z.email(),
    password: z.string().min(12, "Password is required"),
  })
  .strict();
