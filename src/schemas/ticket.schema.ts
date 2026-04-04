import { create } from "node:domain";
import * as z from "zod";

//create ticket schema
export const createTicketSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

//updating ticket schema
// export const updateTicketSchema = z.object({
//   title: z.string().min(3).max(100).optional(),
//   description: z.string().optional(),
//   priority: z.enum(["low", "medium", "high"]).optional(),
// });

export const updateTicketSchema = createTicketSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be present!",
  });
