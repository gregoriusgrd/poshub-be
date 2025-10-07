import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { env } from "../../config/env";
import { TokenPayload } from "../../domains/auth/validations/auth.validations";

config();

const JWT_SECRET = env.JWT_SECRET
const JWT_EXPIRES_IN = "1d" // 1 day

// Buat JWT token baru
export const signJwtToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN })
}

// Verifikasi dan decode JWT token
export const verifyJwtToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload
}