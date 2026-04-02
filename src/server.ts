import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3002", //future frontend
    credentials: true,
  })
);

if (!process.env.SESSION_SECRET) {
  //validate it so TS is happy when secret is declared later on
  throw new Error("SESSION_SECRET is not set");
}

app.use(
  session({
    // genid: function(req){
    //     return genuuid();
    // }
    secret: process.env.SESSION_SECRET,
    resave: false, //no data saving in DB if no changes been made in requests -> Minimal DB hits
    saveUninitialized: false, //no initial data saving if no data at the start
    cookie: { secure: true, httpOnly: true, sameSite: "lax" },
    //through HTTPS connection only - secure: true
    //prevents JS from seeing cookie - httpOnly: true
    //protects against CSRF attacks,allow top level navigation - sameSite: 'lax'
  })
);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.listen("3001", () => {
  console.log("Server running on port 3001");
});
