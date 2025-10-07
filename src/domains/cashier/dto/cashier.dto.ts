export interface CreateCashierDTO {
    email: string;
    password: string;
    fullName: string;
    adminId: number; // karena cashier harus terkait admin
}

export interface UpdateCashierDTO {
    email?: string;
    password?: string;
    fullName?: string;
    profilePicture?: string;
}
