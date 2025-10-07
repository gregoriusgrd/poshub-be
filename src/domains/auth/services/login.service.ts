import { TokenPayload } from "../validations/auth.validations";
import { invalidCredentialsError } from "../errors/auth.errors";
import { findUserByUsername } from "../../user/repositories/user.repository";
import bcrypt from "bcrypt";
import { signJwtToken } from "../../../core/utils/jwt.util";

interface LoginInput {
  username: string;
  password: string;
}

export const loginService = async ({ username, password }: LoginInput) => {
  const user = await findUserByUsername(username);
  if (!user) throw invalidCredentialsError();

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw invalidCredentialsError();

  const tokenPayload: TokenPayload = { userId: user.id, role: user.role };
  const token = signJwtToken(tokenPayload);

  return {
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    },
    token,
  };
};
