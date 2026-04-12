//extracts req.body & req.query, then calls service for business logic
import { createTicket, getTicket, updateTicket } from "../services/service.js";
import { Request, Response } from "express";

type TicketIdParams = {
  //setting type to let TS know
  id: string;
};

export async function getTicketController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorised access" });
    }
    const result = await getTicket(req.query, req.user.id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    // console.log(error);
    return res.status(500).json({
      message: "Error",
    });
  }
}

export async function createTicketController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorised access" });
    }
    const result = await createTicket(req.body, req.user.id);
    return res
      .status(201)
      .json({ success: true, message: "Ticket created", data: result });
  } catch (error: any) {
    // console.log(error);
    if (error.message === "DUPLICATE_TITLE") {
      return res.status(409).json({
        success: false,
        message: "Ticket already exists - please relook at your title",
      });
    }
    if (error.message === "INVALID_TITLE") {
      return res.status(400).json({
        success: false,
        message: "Title is empty",
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function updateTicketController(
  req: Request<TicketIdParams>, //let TS know what content is in here
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorised access" });
  }
  try {
    const updatedTicket = await updateTicket(
      req.params.id,
      req.body,
      req.user.id
    );
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
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - only user that created this ticket can update it",
      });
    }
    if (error.message === "INVALID_STATUS_TRANSITION") {
      return res.status(400).json({
        success: false,
        message: "Invalid status transition",
      });
    }
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
