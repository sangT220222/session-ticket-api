import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SESSION_SECRET) {
  throw new Error("EMPTY_SECRET_KEY");
}
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false, //Minimal DB hits -> no data saving in DB if no changes been made in requests
  saveUninitialized: false, //no initial data saving if empty data at the start
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
  //secure -> HTTPS only connection
  //putt secure:false for dev env
  //httpOnly -> prevent JS from accessing the cookie
  //sameSite:'lax' -> prevent CSRF attackes, allow top site navigation
});
