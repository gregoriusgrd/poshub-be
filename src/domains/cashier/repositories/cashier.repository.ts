import { Role, User } from "@prisma/client";
import prisma from "../../../config/prisma";
import { CreateCashierDTO } from "../dto/create-cashier.dto";
import { UpdateCashierDTO } from "../dto/update-cashier.dto";

// Create a new cashier

export const createCashier = async (data: CreateCashierDTO): Promise<User> => {
    return await prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
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

export const findActiveCashiers = async (options?: { skip?: number; take?: number }): Promise<User[]> => {
    return await prisma.user.findMany({
        where: {
            role: Role.CASHIER,
            isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        skip: options?.skip,
        take: options?.take,
    });
};

// Update a cashier by ID

export const updateCashier = async (id: number, data: UpdateCashierDTO): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data,
    });
}

// Soft delete a cashier by ID

export const softDeleteCashier = async (id: number): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data: { isDeleted: true }, // soft delete di schema
    });
};