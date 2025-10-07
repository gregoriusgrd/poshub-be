import { findUserById } from "../../user/repositories/user.repository";
import { invalidCredentialsError } from "../errors/auth.errors";
import bcrypt from "bcrypt";
import { updateUserPassword } from "../../user/repositories/user.repository";

interface ChangePasswordInput {
    userId: number;
    oldPassword?: string; // Optional utk admin
    newPassword: string;
}

export const changePasswordService = async ({ userId, oldPassword, newPassword }: ChangePasswordInput) => {
  const user = await findUserById(userId);
  if (!user) throw invalidCredentialsError();

  // Jika oldPassword ada (beda untuk cashier), cek dulu
  if (oldPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw invalidCredentialsError();
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await updateUserPassword(userId, hashedPassword);

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    fullName: updatedUser.fullName,
    role: updatedUser.role,
  };
};
