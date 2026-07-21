// seed file for test database
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { Pool } from "pg";

dotenv.config({ path: ".env.test" });

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@testing.com" },
    update: {},
    create: {
      email: "alice@testing.com",
      name: "Admin Alice",
      role: "Admin",
      passwordHash: "password123",
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@testing.com" },
    update: {},
    create: {
      email: "bob@testing.com",
      name: "Bob",
      passwordHash: "password123",
    },
  });
  console.log({ alice, bob });

  await prisma.ticket.upsert({
    where: { id: "some-id" },
    update: {},
    create: {
      title: "First dummy ticket",
      createdByID: alice.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Second dummy ticket",
      createdByID: bob.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Third dummy ticket",
      createdByID: alice.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Fourth dummy ticket",
      createdByID: alice.id,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
