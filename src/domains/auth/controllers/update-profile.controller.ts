import { Request, Response, NextFunction } from "express";
import { updateProfileService } from "../services/update-profile.service";

export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; // requireAuth middleware
    const { fullName, profilePicture, password } = req.body;

    const updatedUser = await updateProfileService({ userId, fullName, profilePicture, password });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return next(err);
  }
};