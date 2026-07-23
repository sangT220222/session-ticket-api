// seed file for test database
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { Pool } from "pg";
import bcrypt from "bcrypt";

dotenv.config({ path: ".env.test" });
const passwordHash = await bcrypt.hash("password1234", 10);

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@testing.com" },
    update: {},
    create: {
      id: "testUser1",
      email: "alice@testing.com",
      name: "Admin Alice",
      role: "Admin",
      passwordHash: passwordHash,
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@testing.com" },
    update: {},
    create: {
      id: "testUser2",
      email: "bob@testing.com",
      name: "Bob",
      passwordHash: passwordHash,
    },
  });
  console.log({ alice, bob });

  await prisma.ticket.upsert({
    where: { id: "some-id" },
    update: {},
    create: {
      title: "First dummy ticket",
      id: "cmrxhd1eu00003b6pdabo15kf",
      createdByID: alice.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Second dummy ticket",
      id: "cmrxhe99200013b6prrbd7sbg",
      createdByID: bob.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Third dummy ticket",
      id: "cmrxhee0d00023b6p9jmn2ic4",
      createdByID: alice.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Fourth dummy ticket",
      id: "cmrxheis400033b6prrdv4pv6",
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
