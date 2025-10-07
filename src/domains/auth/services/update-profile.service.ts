import bcrypt from "bcrypt";
import { updateUserProfile } from "../../user/repositories/user.repository";

interface UpdateProfileInput {
    userId: number;
    fullName?: string;
    password?: string;
    profilePicture?: string;
}

export const updateProfileService = async ({userId, fullName, password, profilePicture}: UpdateProfileInput) => {
    
    const data: Partial<{ fullName: string; profilePicture: string; password: string }> = {};

    if (fullName) data.fullName = fullName;
    if (profilePicture) data.profilePicture = profilePicture;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updatedUser = await updateUserProfile(userId, data);

    return {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
    };
};