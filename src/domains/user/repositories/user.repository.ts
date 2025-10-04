import prisma from "../../../config/prisma";
import { User } from "@prisma/client";

// Function to find a user by email

export const findUserByEmail = async (email:string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { email } });
}