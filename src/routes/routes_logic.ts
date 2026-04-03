import { Router } from "express";
import { prisma } from "../lib/prisma.js";
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

queryRouter.post("/create", async (req, res) => {
  try {
    await prisma.ticket.create({ data: req.body });
    return res.status(201).json({ success: true, message: "Ticket created" });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
