import { Role } from "@prisma/client";
import { createUser, findUserByEmail } from "../../user/repositories/user.repository";
import { invalidCredentialsError } from "../errors/auth.errors";
import bcrypt from 'bcrypt';
import { TokenPayload } from "../../../core/types/jwt.types";

interface RegisterInput {
    email: string;
    password: string;
    fullName: string;
    role: Role;
}

export const registerService = async ({email, password, fullName, role }: RegisterInput) => {

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw invalidCredentialsError;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await createUser(email, hashedPassword, role, fullName);

    // generate token
    const token: TokenPayload = { userId: user.id, role: user.role };

    return {
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        },
        token,
    };
};