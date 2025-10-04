import { CreateCashierDTO } from "../dto/create-cashier.dto";
import bcrypt from 'bcrypt';
import { createCashier, findCashierById, updateCashier, softDeleteCashier, findActiveCashiers } from "../repositories/cashier.repository";
import { notFound } from "../../../core/errors/http-error";
import { UpdateCashierDTO } from "../dto/update-cashier.dto";
import { getPagination } from "../../../core/utils/pagination.util";

export const createCashierService = async (dto: CreateCashierDTO) => {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await createCashier({
        email: dto.email,
        fullName: dto.fullName,
        password: hashedPassword,
    })
}

// GET all cashiers (only active)
export const getAllCashiersService = async (query: any) => {
    const { skip, limit } = getPagination(query, 10, 50); // default 10, max 50
    return await findActiveCashiers({ skip, take: limit });
}

// GET cashier by ID (only if active)

export const getCashierByIdService = async (id: number) => {
    const cashier = await findCashierById(id);
    if (!cashier || cashier.isDeleted) throw notFound;
    return cashier;
}

// UPDATE cashier by ID (only if active)

export const updateCashierService = async (id: number, dto: UpdateCashierDTO) => {
    let updateData: UpdateCashierDTO = { ...dto };

    if (dto.password) {
        updateData.password = await bcrypt.hash(dto.password, 10);
    }

    return await updateCashier(id, updateData);
}

// SOFT DELETE cashier by ID (only if active)

export const deleteCashierService = async (id: number) => {
    return await softDeleteCashier(id)
}