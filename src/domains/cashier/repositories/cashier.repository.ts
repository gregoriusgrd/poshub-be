import { Role, User } from "@prisma/client";
import prisma from "../../../config/prisma";

// Create a new cashier

export const createCashier = async (email: string, password: string, fullName: string): Promise<User> => {
    return await prisma.user.create({
        data: {
            email,
            password,
            fullName,
            role: Role.CASHIER,
        },
    });
};

// Get all cashiers

export const getAllCashiers = async(): Promise<User[]> => {
    return await prisma.user.findMany({
        where: { role: Role.CASHIER },
        orderBy: { createdAt: 'desc' },
    });
};

// Find a cashier by ID

export const findCashierById = async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

// Find Active Cashiers

export const findActiveCashiers = async (): Promise<User[]> => {
    return await prisma.user.findMany({
        where: {
            role: Role.CASHIER,
            isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
    });
};

// Update a cashier by ID

export const updateCashier = async (id: number, data: Partial<Pick<User, 'email' | 'fullName' | 'password'>>): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data,
    });
}

// Soft delete a cashier by ID

export const deleteCashier = async (id: number): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data: { isDeleted: true }, // soft delete di schema
    });
};