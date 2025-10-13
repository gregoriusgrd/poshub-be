import { updateUserProfile } from "../../user/repositories/user.repository";
import { cloudinaryUpload, cloudinaryRemove } from "../../../core/utils/cloudinary.util";
import { internalError, notFound } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import prisma from "../../../config/prisma";

interface UpdateProfileInput {
  userId: number;
  fullName?: string;
  file?: Express.Multer.File;
}

export const updateProfileService = async ({ userId, fullName, file }: UpdateProfileInput) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw notFound(EC.USER_NOT_FOUND);

  const data: Partial<{ fullName: string; profilePicture: string }> = {};

  if (fullName) data.fullName = fullName;

  // Upload image baru jika ada file
  if (file) {
    try {
      // hapus foto lama dari Cloudinary (kalau ada)
      if (user.profilePicture) {
        await cloudinaryRemove(user.profilePicture);
      }

      const uploadResult = await cloudinaryUpload(file, "users");
      data.profilePicture = uploadResult.secure_url;
    } catch (error) {
      throw internalError("Failed to upload profile image", EC.INTERNAL_SERVER_ERROR, error);
    }
  }

  const updatedUser = await updateUserProfile(userId, data);

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    fullName: updatedUser.fullName,
    role: updatedUser.role,
    profilePicture: updatedUser.profilePicture,
  };
};
