import session from "express-session";
import dotenv from "dotenv";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}

//intialising client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);

//initialising store
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
  // ttl: 60 //ttl is in seconds - this can be set explicitly, however, it usually derives from cookie.maxAge automatically
});

if (!process.env.SESSION_COOKIE_NAME) {
  throw new Error("EMPTY_SESSION_NAME");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("EMPTY_SECRET_KEY");
}

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;

export const sessionMiddleware = session({
  store: redisStore,
  name: process.env.SESSION_COOKIE_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, //Minimal DB hits -> no data saving in DB if no changes been made in requests
  saveUninitialized: false, //no initial data saving if empty data at the start
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 1000, //1 minute for test
  },
  //secure -> HTTPS only connection
  //putt secure:false for dev env
  //httpOnly -> prevent JS from accessing the cookie
  //sameSite:'lax' -> prevent CSRF attackes, allow top site navigation
});
