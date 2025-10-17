import { CreateCashierDTO, UpdateCashierDTO } from "../dto/cashier.dto";
import bcrypt from "bcrypt";
import {
  createCashier,
  findCashierById,
  updateCashier,
  softDeleteCashier,
  getAllCashiers,
  countCashiers,
} from "../repositories/cashier.repository";
import { notFound } from "../../../core/errors/http-error";
import { getPagination } from "../../../core/utils/pagination.util";
import { User } from "@prisma/client";
import prisma from "../../../config/prisma";
import { badRequest, internalError } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";

// CREATE cashier
export const createCashierService = async (dto: CreateCashierDTO) => {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  return await createCashier({
    username: dto.username,
    fullName: dto.fullName,
    password: hashedPassword,
  });
};

// GET all cashiers for the admin (with pagination)
export const getAllCashiersService = async (query: any) => {
  const { skip, limit, page } = getPagination(query, 10, 50);
  const search = query.search?.toString() || undefined;
  const sortBy = query.sortBy?.toString() as keyof User | undefined;
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  // Hitung total items
  const totalItems = await countCashiers(search);

  // Ambil data dengan pagination
  const cashiers = await getAllCashiers({ skip, take: limit, search, sortBy, sortOrder });

  // Hitung total halaman
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: cashiers,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };
};

// GET cashier by ID
export const getCashierByIdService = async (id: number) => {
  const cashier = await findCashierById(id);
  if (!cashier || cashier.isDeleted) throw notFound;
  return cashier;
};

// UPDATE cashier by ID
export const updateCashierService = async (id: number, dto: UpdateCashierDTO) => {
  const cashier = await findCashierById(id);
  if (!cashier || cashier.isDeleted) throw notFound;

  const updateData: UpdateCashierDTO = { ...dto };

  if (dto.password) {
    updateData.password = await bcrypt.hash(dto.password, 10);
  }

  return await updateCashier(id, updateData);
};

/**
 * Soft delete cashier
 * Tidak boleh dihapus jika masih terlibat di transaksi (record historical data)
 * Tidak boleh dihapus dua kali
 */
export const deleteCashierService = async (id: number) => {
  // Cari cashier
  const cashier = await findCashierById(id);
  if (!cashier || cashier.isDeleted) {
    throw notFound("Cashier not found", EC.NOT_FOUND);
  }

  try {
    // Cek apakah cashier masih punya transaksi
    const hasTransactions = await prisma.transaction.findFirst({
      where: { cashierId: id },
    });

    if (hasTransactions) {
      throw badRequest(
        "Cannot delete this cashier because they are associated with existing transactions.",
        EC.CASHIER_HAS_TRANSACTIONS
      );
    }

    // Soft delete cashier
    await softDeleteCashier(id);

    return { message: "Cashier soft deleted successfully" };
  } catch (err) {
    // fallback — tangani error Prisma atau runtime
    throw internalError("Failed to delete cashier", EC.INTERNAL_SERVER_ERROR, err);
  }
};
