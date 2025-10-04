import prisma from "../../../config/prisma";
import { User } from "@prisma/client";

// Function to find a user by email

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Function to create a new user

export const createUser = async (
  email: string,
  hashedPassword: string,
  role: "ADMIN" | "CASHIER",
  fullName: string
): Promise<User> => {
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      fullName,
    },
  });
};