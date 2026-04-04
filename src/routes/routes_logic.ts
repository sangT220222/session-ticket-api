import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../schemas/ticket.schema.js";
import {
  validateCreateTicket,
  validateUpdateTicket,
} from "../middleware/validation.js";
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

queryRouter.get("/:id", (req, res) => {
  //dynamic routing
  res.send(`${req.params.id} printed`);
});

queryRouter.post(
  "/create",
  validateCreateTicket(createTicketSchema),
  async (req, res) => {
    try {
      await prisma.ticket.create({ data: req.body });
      return res.status(201).json({ success: true, message: "Ticket created" });
    } catch (error) {
      // console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

queryRouter.patch(
  "/update/:id",
  validateUpdateTicket(updateTicketSchema),
  async (req, res) => {
    try {
      //update
      if (!req.params.id || Array.isArray(req.params.id)) {
        return res.status(400).json({ message: "Ticket id is required" });
      }
      const ticketId = req.params.id;
      await prisma.ticket.update({
        where: { id: ticketId },
        data: req.body,
      });
      return res.status(204).json({ message: "Ticket has been updated" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);
