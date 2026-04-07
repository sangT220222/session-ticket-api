//extracts req.body & req.query, then calls service for business logic
import { createTicket, updateTicket } from "../services/service.js";
import { Request, Response } from "express";

type TicketIdParams = {
  //setting type to let TS know
  id: string;
};

export async function createTicketController(req: Request, res: Response) {
  try {
    const result = await createTicket(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Ticket created", data: result });
  } catch (error: any) {
    // console.log(error);
    if (error.message === "DUPLICATE TITLE") {
      return res.status(409).json({
        success: false,
        message: "Ticket already exists - please relook at your title",
      });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateTicketController(
  req: Request<TicketIdParams>, //let TS know what content is in here
  res: Response
) {
  try {
    const updatedTicket = await updateTicket(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Ticket has been updated",
      data: updatedTicket,
    });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }
    if (error.message === "INVALID STATUS TRANSITION") {
      return res.status(400).json({
        success: false,
        message: "Invalid status transition",
      });
    }
    // console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
