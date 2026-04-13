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

export const getTickets = async (
  query: GetTicketInput,
  userID: string,
  userRole: string
) => {
  const {
    title,
    description,
    priority,
    status,
    sort,
    //default if no query param(s)
    order = "desc",
    page = 1,
    limit = 10,
  } = query;

  const safeLimit = Math.min(limit, 50); // extra safety cap - in case user types limit=10000 for eg
  //need to check user role and determine the SQL statement
  const userInfo = await prisma.user.findUnique({ where: { id: userID } });
  if (!userInfo) {
    throw new Error("USER_NOT_FOUND");
  }

  const isAdmin = userRole === "Admin";
  const whereClause = {
    ...(title && { title: { contains: title, mode: "insensitive" as const } }),
    ...(description && {
      description: { contains: description, mode: "insensitive" as const },
    }),
    ...(priority && { priority }),
    ...(status && { status }),
    ...(!isAdmin && { createdByID: userID }),
  };

  return prisma.ticket.findMany({
    where: whereClause,
    orderBy: sort ? { [sort]: order } : { createdAt: order },
    skip: (page - 1) * safeLimit,
    take: safeLimit,
  });
};

export const getTicket = async (
  ticketId: string,
  userID: string,
  userRole: string
) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userID } });
  if (!userInfo) {
    throw new Error("USER_NOT_FOUND");
  }
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    throw new Error("NOT_FOUND");
  }
  if (ticket.createdByID !== userID && userRole !== "Admin") {
    throw new Error("FORBIDDEN");
  }
  return ticket;
};

export const createTicket = async (
  newData: CreateTicketInput,
  userID: string
) => {
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
      createdByID: userID,
    },
  });
  //default status is todo when ticket being created
};

export const updateTicket = async (
  ticketId: string,
  data: UpdateTicketInput,
  userID: string,
  userRole: string
) => {
  const existing = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  if (existing.createdByID !== userID && userRole !== "Admin") {
    throw new Error("FORBIDDEN");
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
