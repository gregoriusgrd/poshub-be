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

// SOFT DELETE cashier by ID
export const deleteCashierService = async (id: number) => {
  const cashier = await findCashierById(id);
  if (!cashier || cashier.isDeleted) throw notFound;

  return await softDeleteCashier(id);
};
