import prisma from "../../../config/prisma";
import { getPagination } from "../../../core/utils/pagination.util";

interface GetTransactionHistoryParams {
    page?: number;
    limit?: number;
    cashierId?: number;
    shiftId?: number;
    startDate?: string;
    endDate?: string;
    paymentMethod?: 'CASH' | 'DEBIT_CARD';
    search?: string;
}

export const getTransactionHistoryService = async (params: GetTransactionHistoryParams) => {
    const {
        page = 1,
        limit = 10,
        cashierId,
        shiftId,
        startDate,
        endDate,
        paymentMethod,
        search = "",
    } = params;

    const { skip, take, page: currentPage, limit: perPage } = getPagination({ page, limit });

    const where: any = {};

    // Filter by cashierId, shiftId, paymentMethod, date range
    if (cashierId) where.cashierId = cashierId;
    if (shiftId) where.shiftId = shiftId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (startDate || endDate) {
        where.transactionTime = {};
        if (startDate) where.transactionTime.gte = new Date(startDate);
        if (endDate) where.transactionTime.lte = new Date(endDate);
    }

    // Search by cashier name or product name
    if (search) {
        where.OR = [
        {
            cashier: {
            fullName: {
                contains: search,
                mode: "insensitive",
            },
            },
        },
        {
            transactionItems: {
            some: {
                product: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
                },
            },
            },
        },
        ];
    }

    // ambil data & total count secara bersamaan
    const [data, total] = await Promise.all([
        prisma.transaction.findMany({
        where,
        skip,
        take,
        orderBy: { transactionTime: "desc" },
        include: {
            cashier: { select: { id: true, fullName: true } },
            transactionItems: {
            include: {
                product: { select: { id: true, name: true, price: true } },
            },
            },
        },
        }),
        prisma.transaction.count({ where }),
    ]);

    // return pagination result
    return {
        data,
        meta: {
            total,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(total / perPage),
        }
    }
}