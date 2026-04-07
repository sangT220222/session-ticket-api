//business logic

import { prisma } from "../lib/prisma.js";
import { isValidStatusTransition } from "./ticket.rules.js";
import {
  createTicketSchema,
  getTicketQuerySchema,
  updateTicketSchema,
} from "../schemas/ticket.schema.js";
import * as z from "zod";

type GetTicketInput = z.infer<typeof getTicketQuerySchema>;

type CreateTicketInput = z.infer<typeof createTicketSchema>;

type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export const getTicket = async (query: GetTicketInput) => {
  const { title, description, priority, status, sort, order = "desc" } = query;
  return prisma.ticket.findMany({
    where: {
      ...(title && { title: { contains: title, mode: "insensitive" } }),
      ...(description && {
        description: { contains: description, mode: "insensitive" },
      }),
      ...(priority && { priority }),
      ...(status && { status }),
    },
    orderBy: sort ? { [sort]: order } : { createdAt: "desc" },
  });
};

export const createTicket = async (newData: CreateTicketInput) => {
  //check for duplicate title
  const duplicate = await prisma.ticket.findFirst({
    where: { title: newData.title },
  });
  if (duplicate) {
    throw new Error("DUPLICATE_TITLE");
  }

  const cleanedTitle = newData.title.trim();
  if (!cleanedTitle) {
    throw new Error("INVALID_TITLE");
  }

  return prisma.ticket.create({
    data: {
      ...newData,
      title: cleanedTitle,
      status: "todo",
    },
  });
  //default status is todo when ticket being created
};

export const updateTicket = async (
  ticketId: string,
  data: UpdateTicketInput
) => {
  const existing = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  if (data.status && existing.status) {
    const isValid = isValidStatusTransition(existing.status, data.status);

    if (!isValid) {
      throw new Error("INVALID_STATUS_TRANSITION");
    }
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: data,
  });

  return updatedTicket;
};
