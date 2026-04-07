import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createTicketSchema,
  updateTicketSchema,
  ticketIdParam,
  querySchema,
} from "../schemas/ticket.schema.js";
import {
  validateCreateTicket,
  validateUpdateTicket,
  validateParams,
  validateQuery,
} from "../middleware/validation.js";

import {
  createTicketController,
  updateTicketController,
} from "../controllers/controller.js";
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

queryRouter.get("/tickets", validateQuery(querySchema), async (req, res) => {
  try {
    //validating and extracting params using Zod - also giving proper typ
    const { title, description, priority } = querySchema.parse(req.query);
    const results = await prisma.ticket.findMany({
      where: {
        ...(title && { title }),
        // Conditionally include 'title' filter only if it exists in the query
        // e.g. if title = "test" -> { title: "test" }, otherwise omitted
        ...(description && { description }),
        ...(priority && { priority }),
      },
    });
    return res.status(200).json({
      success: true,
      data: results,
      message: "TEST",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

queryRouter.post(
  "/create",
  validateCreateTicket(createTicketSchema),
  createTicketController
);

queryRouter.patch(
  "/update/:id",
  validateParams(ticketIdParam),
  validateUpdateTicket(updateTicketSchema),
  // Request<TicketIdParams> let TS know what content is in here
  updateTicketController
);
