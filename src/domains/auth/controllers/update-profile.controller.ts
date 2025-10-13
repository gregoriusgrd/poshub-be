import { Request, Response, NextFunction } from "express";
import { updateProfileService } from "../services/update-profile.service";
import { updateProfileSchema } from "../validations/auth.validations";

export const updateProfileController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; // dari requireAuth middleware

    const { fullName } = updateProfileSchema.parse(req.body);

    // file dari multer
    const file = req.file;

    const updatedUser = await updateProfileService({
      userId,
      fullName,
      file,
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
