"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionHistoryService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const pagination_util_1 = require("../../../core/utils/pagination.util");
const getTransactionHistoryService = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, cashierId, role, shiftId, startDate, endDate, paymentMethod, search = "", sortBy = "createdAt", sortOrder = "desc", } = params;
    const { skip, take, page: currentPage, limit: perPage } = (0, pagination_util_1.getPagination)({ page, limit });
    const where = {};
    // 1. Jika role CASHIER, batasi hanya transaksi miliknya & di shift aktif atau hari ini
    if (role === "CASHIER") {
        // hanya bisa lihat transaksi miliknya
        where.cashierId = cashierId;
        // cari shift aktif kasir ini
        const activeShift = yield prisma_1.default.shift.findFirst({
            where: { cashierId, status: "OPEN" },
            select: { id: true },
        });
        if (activeShift) {
            // filter transaksi yang terjadi setelah shift dibuka
            where.shiftId = activeShift.id;
        }
        else {
            // kalau tidak ada shift aktif, tampilkan transaksi hari ini
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            where.createdAt = { gte: today, lt: tomorrow };
        }
    }
    // 2. Filter opsional lainnya
    if (role === "ADMIN" && cashierId)
        where.cashierId = cashierId;
    if (shiftId)
        where.shiftId = shiftId;
    if (paymentMethod)
        where.paymentMethod = paymentMethod;
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate)
            where.createdAt.gte = new Date(startDate);
        if (endDate)
            where.createdAt.lte = new Date(endDate);
    }
    // Search by transactionCode, cashier name, product name
    if (search) {
        where.OR = [
            { transactionCode: { contains: search, mode: "insensitive" } },
            { cashier: { fullName: { contains: search, mode: "insensitive" } } },
            {
                transactionItems: {
                    some: { product: { name: { contains: search, mode: "insensitive" } } },
                },
            },
        ];
    }
    // 4. query data dan count total
    const [data, total] = yield Promise.all([
        prisma_1.default.transaction.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: sortOrder },
            include: {
                cashier: { select: { id: true, fullName: true } },
            },
        }),
        prisma_1.default.transaction.count({ where }),
    ]);
    // 5. return dengan pagination meta
    return {
        data,
        meta: {
            total,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(total / perPage),
        },
    };
});
exports.getTransactionHistoryService = getTransactionHistoryService;
