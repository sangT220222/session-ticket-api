import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";
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
import { success } from "zod";
export const queryRouter = Router();
type TicketIdParams = {
  //setting type to let TS know
  id: string;
};

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
  async (req, res) => {
    try {
      await prisma.ticket.create({ data: req.body });
      return res.status(201).json({ success: true, message: "Ticket created" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

queryRouter.patch(
  "/update/:id",
  validateParams(ticketIdParam),
  validateUpdateTicket(updateTicketSchema),
  //Request<TicketIdParams> let TS know what content is in here
  async (req: Request<TicketIdParams>, res: Response) => {
    try {
      //update
      const ticketId = req.params.id;
      await prisma.ticket.update({
        where: { id: ticketId },
        data: req.body,
      });
      return res.status(200).json({ message: "Ticket has been updated" });
    } catch (error: any) {
      if (error.code === "P2025") {
        //PRISMA "record not found"
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);
