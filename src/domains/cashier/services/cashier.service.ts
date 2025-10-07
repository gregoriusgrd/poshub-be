import { CreateCashierDTO } from "../dto/create-cashier.dto";
import { UpdateCashierDTO } from "../dto/update-cashier.dto";
import bcrypt from "bcrypt";
import {
  createCashier,
  findCashierById,
  updateCashier,
  softDeleteCashier,
  getAllCashiers,
} from "../repositories/cashier.repository";
import { notFound } from "../../../core/errors/http-error";
import { getPagination } from "../../../core/utils/pagination.util";

// CREATE cashier
export const createCashierService = async (dto: CreateCashierDTO, adminId: number) => {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  return await createCashier({
    email: dto.email,
    fullName: dto.fullName,
    password: hashedPassword,
    adminId,
  });
};

// GET all cashiers for the admin (with pagination)
export const getAllCashiersService = async (adminId: number, query: any) => {
  const { skip, limit } = getPagination(query, 10, 50); // default 10, max 50
  return await getAllCashiers(adminId, { skip, take: limit });
};

// GET cashier by ID
export const getCashierByIdService = async (id: number, adminId: number) => {
  const cashier = await findCashierById(id);
  if (!cashier || cashier.isDeleted || cashier.adminId !== adminId) throw notFound;
  return cashier;
};

// UPDATE cashier by ID
export const updateCashierService = async (id: number, dto: UpdateCashierDTO, adminId: number) => {
  const cashier = await findCashierById(id);
  if (!cashier || cashier.isDeleted || cashier.adminId !== adminId) throw notFound;

  const updateData: UpdateCashierDTO = { ...dto };

  if (dto.password) {
    updateData.password = await bcrypt.hash(dto.password, 10);
  }

  return await updateCashier(id, updateData);
};

// SOFT DELETE cashier by ID
export const deleteCashierService = async (id: number, adminId: number) => {
  const cashier = await findCashierById(id);
  if (!cashier || cashier.isDeleted || cashier.adminId !== adminId) throw notFound;

  return await softDeleteCashier(id);
};
