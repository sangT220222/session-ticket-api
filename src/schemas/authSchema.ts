import * as z from "zod";

export const registerUserSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters long"),
    confirmPassword: z.string(),
    name: z.string().min(1).optional(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });

export const loginUserSchema = z
  .object({
    email: z.email(),
    password: z.string().min(12, "Password is required"),
  })
  .strict();
