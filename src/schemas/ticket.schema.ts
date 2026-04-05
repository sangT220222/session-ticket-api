import * as z from "zod";

//create ticket schema
export const createTicketSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

export const updateTicketSchema = createTicketSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be present!",
  });

export const ticketIdParam = z.object({
  id: z.string().cuid("Invalid ticket id"),
});
