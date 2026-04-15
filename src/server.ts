import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import { queryRouter } from "./routes/routes_logic.js";
import { authRouter } from "./routes/auth_routes.js";
import { sessionMiddleware } from "./authentication/session.js";
import helmet from "helmet";

// dotenv.config();
const app = express();
app.use(express.json());
//helmet adds secure HTTP headers to every responses to protect against common web vulneribilities
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3002", //future frontend
    credentials: true,
  })
);

app.use(sessionMiddleware);

app.use("/api", queryRouter); //mounting the Router with the parameter
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.listen("3001", () => {
  console.log("Server running on port 3001");
});
