import dotenv from "dotenv";

dotenv.config();

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

if (!process.env.DUMMY_HASH) {
  throw new Error("DUMMY_HASH is not set");
}

export const DUMMY_HASH = process.env.DUMMY_HASH;
