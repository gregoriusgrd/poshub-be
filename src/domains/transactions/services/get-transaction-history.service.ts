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
    role: 'ADMIN' | 'CASHIER';
}

export const getTransactionHistoryService = async (params: GetTransactionHistoryParams) => {
    const {
        page = 1,
        limit = 10,
        cashierId,
        role,
        shiftId,
        startDate,
        endDate,
        paymentMethod,
        search = "",
    } = params;

    const { skip, take, page: currentPage, limit: perPage } = getPagination({ page, limit });

    const where: any = {};

    // 1. Jika role CASHIER, batasi hanya transaksi miliknya & di shift aktif atau hari ini
    if (role === "CASHIER") {

        // hanya bisa lihat transaksi miliknya
        where.cashierId = cashierId;

        // cari shift aktif kasir ini
        const activeShift = await prisma.shift.findFirst({
            where: { cashierId, status: "OPEN" },
            select: { id: true, openedAt: true },
        });

        if (activeShift) {
            // filter transaksi yang terjadi setelah shift dibuka
            where.shiftId = activeShift.id;
        } else {
            // kalau tidak ada shift aktif, tampilkan transaksi hari ini
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            where.transactionTime = { gte: today, lt: tomorrow };
        }
    }

    // 2. Filter opsional lainnya
    if (role === "ADMIN" && cashierId) where.cashierId = cashierId;
    if (shiftId) where.shiftId = shiftId;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    if (startDate || endDate) {
        where.transactionTime = {};
        if (startDate) where.transactionTime.gte = new Date(startDate);
        if (endDate) where.transactionTime.lte = new Date(endDate);
    }

    // Search by transactionCode, cashier name, product name
    if (search) {
        where.OR = [
            { transactionCode: { contains: search, mode: "insensitive" } },
            {
                cashier: { fullName: { contains: search, mode: "insensitive" } },
            },
            {
                transactionItems: {
                    some: {
                        product: { name: { contains: search, mode: "insensitive" } },
                    },
                },
            },
        ];
    }

    // 4. query data dan count total
    const [data, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            skip,
            take,
            orderBy: { transactionTime: "desc" },
            include: {
                cashier: { select: { id: true, fullName: true } },
            },
        }),
        prisma.transaction.count({ where }),
    ]);

    // 5. return dengan pagination meta
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