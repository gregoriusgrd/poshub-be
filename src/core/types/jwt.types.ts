import { Role } from "@prisma/client";

// payload JWT

export interface TokenPayload {
  userId: number;
  role: Role;
}