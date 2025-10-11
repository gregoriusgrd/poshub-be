import { findUserById } from "../../user/repositories/user.repository"
import { invalidCredentialsError } from "../errors/auth.errors";


export const getProfileService = async (userId: number) => {
    const user = await findUserById(userId);
    if (!user) throw invalidCredentialsError();

    return {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        profilePicture: user.profilePicture,
    }
}