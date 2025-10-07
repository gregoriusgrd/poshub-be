import { Cashier } from "@prisma/client";
import prisma from "../../../config/prisma";
import { CreateCashierDTO, UpdateCashierDTO } from "../dto/cashier.dto";

// Create a new cashier

export const createCashier = async (data: CreateCashierDTO): Promise<Cashier> => {
    return await prisma.cashier.create({
        data: {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            adminId: data.adminId,
        },
    });
};

// Get all cashiers

export const getAllCashiers = async (adminId: number, options?: { skip?: number; take?: number }): Promise<Cashier[]> => {
    return await prisma.cashier.findMany({
        where: { 
            adminId,
            isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        skip: options?.skip,
        take: options?.take,
    });
};

// Find a cashier by ID

export const findCashierById = async (id: number, adminId?: number): Promise<Cashier | null> => {
  return await prisma.cashier.findFirst({
    where: { id, ...(adminId && { adminId }) },
  });
};

// Update a cashier by ID

export const updateCashier = async (id: number, data: UpdateCashierDTO): Promise<Cashier> => {
    return await prisma.cashier.update({
        where: { id },
        data,
    });
};

// Soft delete a cashier by ID

export const softDeleteCashier = async (id: number): Promise<Cashier> => {
    return await prisma.cashier.update({
        where: { id },
        data: { isDeleted: true },
    });
};