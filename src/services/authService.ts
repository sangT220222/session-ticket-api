//check if users are on the db already - email dupe

import { prisma } from "../lib/prisma.js";
import * as z from "zod";
import * as bcrypt from "bcrypt";

import { loginUserSchema, registerUserSchema } from "../schemas/authSchema.js";

type RegisterUserBody = z.infer<typeof registerUserSchema>;
type LoginUserBody = z.infer<typeof loginUserSchema>;

export const registerUser = async (userData: RegisterUserBody) => {
  const dupelicateUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (dupelicateUser) {
    throw new Error("DUPLICATE_EMAIL");
  }

  if (!userData.password) {
    throw new Error("EMPTY_PASSWORD");
  }

  const passwordHashed = await bcrypt.hash(userData.password, 10);

  return prisma.user.create({
    data: {
      email: userData.email,
      passwordHash: passwordHashed,
      name: userData.name,
    },
  });
};

export const loginUser = async (userData: LoginUserBody) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (!user) {
    throw new Error("INVALID");
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("INVALID");
  }
  return user.id;
};
