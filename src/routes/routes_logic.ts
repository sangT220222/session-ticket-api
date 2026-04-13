import { Router } from "express";
import {
  createTicketSchema,
  updateTicketSchema,
  ticketIdParam,
  getTicketQuerySchema,
} from "../schemas/ticket.schema.js";
import {
  validateCreateTicket,
  validateUpdateTicket,
  validateParams,
  validateQuery,
} from "../middleware/validation.js";

import {
  createTicketController,
  getTicketsController,
  getSingleTicketController,
  updateTicketController,
} from "../controllers/controller.js";

import { requireAuth } from "../controllers/authController.js";

export const queryRouter = Router();

//Testing prisma connection - uncomment if needed
// try {
//   await prisma.$connect();
//   console.log("Prisma connected successfully");
// } catch (error) {
//   console.error("Prisma failed to connect");
//   console.error(error);
// }
//Testing prisma connection - uncomment if needed

// queryRouter.get("/:id", (req, res) => {
//   //dynamic routing
//   res.send(`${req.params.id} printed`);
// });

queryRouter.get(
  "/tickets",
  requireAuth,
  validateQuery(getTicketQuerySchema),
  getTicketsController
);

queryRouter.get("/tickets/:id", requireAuth, getSingleTicketController);

queryRouter.post(
  "/create",
  requireAuth,
  validateCreateTicket(createTicketSchema),
  createTicketController
);

queryRouter.patch(
  "/update/:id",
  requireAuth,
  validateParams(ticketIdParam),
  validateUpdateTicket(updateTicketSchema),
  updateTicketController
);
