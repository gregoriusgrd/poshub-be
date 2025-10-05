import { Role } from "@prisma/client";

// payload JWT

// ada 2 code satu lagi di auth.validations.ts

export interface TokenPayload {
  userId: number;
  role: Role;
}