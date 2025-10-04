import { TokenPayload } from "../../../core/types/jwt.types";
import { findUserByEmail } from "../../user/repositories/user.repository";
import { invalidCredentialsError } from "../errors/auth.errors";
import bcrypt from "bcrypt";

interface LoginInput {
  email: string;
  password: string;
}

export const loginService = async ({ email, password }: LoginInput) => {
  const user = await findUserByEmail(email);
  if (!user) throw invalidCredentialsError();

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw invalidCredentialsError();

  const token: TokenPayload = { userId: user.id, role: user.role };
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
