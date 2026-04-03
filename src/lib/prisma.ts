//new setup method from the introduction of Prisma ORM v7
//ref: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7#driver-adapters-and-client-instantiation

import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
});

export const prisma = new PrismaClient({ adapter });
