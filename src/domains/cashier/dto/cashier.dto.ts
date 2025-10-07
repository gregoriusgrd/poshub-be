export interface CreateCashierDTO {
    username: string;
    password: string;
    fullName: string;
}

// tidak bisa ganti username

export interface UpdateCashierDTO {
    password?: string;
    fullName?: string;
    profilePicture?: string;
}
