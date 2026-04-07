import * as z from "zod";

//create ticket schema
export const createTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(100),
    description: z.string().trim().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
  })
  .strict();

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    status: z.enum(["todo", "in_progress", "completed"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be present",
  });

export const ticketIdParam = z.object({
  id: z.string().cuid("Invalid ticket id"),
});

export const getTicketQuerySchema = z
  .object({
    title: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    status: z.enum(["todo", "in_progress", "completed"]).optional(),
    sort: z.enum(["createdAt", "priority", "status"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  })
  .strict();
