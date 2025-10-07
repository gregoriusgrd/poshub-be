import { User } from "@prisma/client";
import prisma from "../../../config/prisma";
import { CreateCashierDTO, UpdateCashierDTO } from "../dto/cashier.dto";

// Create a new cashier

export const createCashier = async (data: CreateCashierDTO): Promise<User> => {
    return await prisma.user.create({
        data: {
            username: data.username,
            password: data.password,
            fullName: data.fullName,
            role: 'CASHIER',
        },
    });
};

// Get all cashiers

export const getAllCashiers = async (options?: { skip?: number; take?: number }): Promise<User[]> => {
    return await prisma.user.findMany({
        where: { role: 'CASHIER', isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip: options?.skip,
        take: options?.take,
    });
};

// Find a cashier by ID

export const findCashierById = async (id: number): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: { id, role: 'CASHIER', isDeleted: false },
  });
};

// Update a cashier by ID

export const updateCashier = async (id: number, data: UpdateCashierDTO): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data,
    });
};

// Soft delete a cashier by ID

export const softDeleteCashier = async (id: number): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data: { isDeleted: true },
    });
};