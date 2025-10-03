import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Role } from "@prisma/client";
import { env } from "../../config/env";

config();

const JWT_SECRET = env.JWT_SECRET
const JWT_EXPIRES_IN = "1d" // 1 day

// Isi token JWT yang disimpan di cookie / Authorization header
interface TokenPayload {
    userId: number;
    role: Role;
}

// Buat JWT token baru
export const signJwtToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN })
}

// Verifikasi dan decode JWT token
export const verifyJwtToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload
}