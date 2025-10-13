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

export const getAllCashiers = async (options?: {
  skip?: number;
  take?: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
}): Promise<User[]> => {
  const where: any = {
    role: 'CASHIER',
    isDeleted: false,
  };

  if (options?.search) {
    where.OR = [
      { username: { contains: options.search, mode: 'insensitive' } },
      { fullName: { contains: options.search, mode: 'insensitive' } },
    ];
  }

  return await prisma.user.findMany({
    where,
    orderBy: {
      [options?.sortBy || 'createdAt']: options?.sortOrder || 'desc',
    },
    skip: options?.skip,
    take: options?.take,
  });
};

// Count total cashiers (for pagination)
export const countCashiers = async (search?: string): Promise<number> => {
  const where: any = {
    role: "CASHIER",
    isDeleted: false,
  };

  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { fullName: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.user.count({ where });
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