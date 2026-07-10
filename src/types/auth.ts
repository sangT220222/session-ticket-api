import dotenv from "dotenv";

dotenv.config();

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

if (!process.env.TEST_DUMMY_HASH) {
  throw new Error("DUMMY_HASH is not set");
}

export const TEST_DUMMY_HASH = process.env.TEST_DUMMY_HASH;
