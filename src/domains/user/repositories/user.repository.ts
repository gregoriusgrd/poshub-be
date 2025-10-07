import prisma from "../../../config/prisma";
import { User } from "@prisma/client";

// Function to find a user by username

export const findUserByUsername = async (username: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

// Find user by ID (helper for services)

export const findUserById = async (userId: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

// Update user password
export const updateUserPassword = async (userId: number, newPassword: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};

// Update user profile (fullName, profilePicture, optional password)
export const updateUserProfile = async (
  userId: number,
  data: Partial<{ fullName: string; profilePicture: string; password: string }>
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};