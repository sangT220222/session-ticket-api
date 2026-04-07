//business logic

import { prisma } from "../lib/prisma.js";
import { isValidStatusTransition } from "./ticket.rules.js";
type CreateTicketInput = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "completed";
};

type UpdateTicketInput = {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status?: "todo" | "in_progress" | "completed";
};

export const createTicket = async (newData: CreateTicketInput) => {
  //check for duplicate title
  const duplicate = await prisma.ticket.findFirst({
    where: { title: newData.title },
  });
  if (duplicate) {
    throw new Error("DUPLICATE TITLE");
  }
  const result = await prisma.ticket.create({ data: newData });

  return result;
};

export const updateTicket = async (
  ticketId: string,
  data: UpdateTicketInput
) => {
  const existing = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!existing) {
    throw new Error("NOT FOUND");
  }

  if (data.status && existing.status) {
    const isValid = isValidStatusTransition(existing.status, data.status);

    if (!isValid) {
      throw new Error("INVALID STATUS TRANSITION");
    }
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: data,
  });

  return updatedTicket;
};
