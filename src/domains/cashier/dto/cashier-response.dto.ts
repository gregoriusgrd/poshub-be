import { Role } from "@prisma/client";

export interface CashierResponseDTO {
    id: number;
    email: string;
    fullName: string;
    role: Role;
    profilePicture: string | null;
    createdAt: Date;
    updatedAt: Date;
}