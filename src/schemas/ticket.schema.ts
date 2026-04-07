import * as z from "zod";

export const getTicketQuerySchema = z
  .object({
    title: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    status: z.enum(["todo", "in_progress", "completed"]).optional(),
    sort: z.enum(["createdAt", "priority", "status"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    //coerce converts the string to number
  })
  .strict();

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
