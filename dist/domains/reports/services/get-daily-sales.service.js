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
exports.getDailySalesService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const pagination_util_1 = require("../../../core/utils/pagination.util");
const date_fns_1 = require("date-fns");
/**
 * Menampilkan total transaksi dan total pendapatan (cash, debit, total) per hari dalam periode tertentu
 */
const getDailySalesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, start, end, paymentMethod, search, sortBy = "date", order = "desc" } = query;
    // Tentukan range tanggal (default: hari ini)
    const startDate = date
        ? (0, date_fns_1.startOfDay)(new Date(date))
        : start
            ? new Date(start)
            : (0, date_fns_1.startOfDay)(new Date());
    const endDate = date
        ? (0, date_fns_1.endOfDay)(new Date(date))
        : end
            ? new Date(end)
            : (0, date_fns_1.endOfDay)(new Date());
    // Pagination setup
    const { page, limit, skip, take } = (0, pagination_util_1.getPagination)({
        page: Number(query.page),
        limit: Number(query.limit),
    });
    // Filter dasar
    const whereClause = {
        transactionTime: { gte: startDate, lte: endDate },
    };
    if (paymentMethod) {
        whereClause.paymentMethod = paymentMethod;
    }
    if (search) {
        whereClause.cashier = {
            fullName: { contains: search, mode: "insensitive" },
        };
    }
    // Ambil semua transaksi dalam range
    const transactions = yield prisma_1.default.transaction.findMany({
        where: whereClause,
        select: {
            id: true,
            totalAmount: true,
            paymentMethod: true,
            transactionTime: true,
            cashier: { select: { fullName: true } },
        },
    });
    // Group by date
    const grouped = {};
    for (const trx of transactions) {
        const dateKey = trx.transactionTime.toISOString().split("T")[0];
        if (!grouped[dateKey]) {
            grouped[dateKey] = {
                date: dateKey,
                totalTransactions: 0,
                totalRevenue: 0,
                totalCash: 0,
                totalDebit: 0,
            };
        }
        grouped[dateKey].totalTransactions++;
        grouped[dateKey].totalRevenue += Number(trx.totalAmount);
        if (trx.paymentMethod === "CASH")
            grouped[dateKey].totalCash += Number(trx.totalAmount);
        else if (trx.paymentMethod === "DEBIT_CARD")
            grouped[dateKey].totalDebit += Number(trx.totalAmount);
    }
    const reportArray = Object.values(grouped);
    const sortField = sortBy || "date";
    const sortOrder = order === "asc" ? "asc" : "desc";
    const sorted = reportArray.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB)
            return 0;
        return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
    // Pagination hasil akhir
    const paginated = sorted.slice(skip, skip + take);
    return {
        data: paginated,
        meta: {
            page,
            limit,
            totalItems: sorted.length,
            totalPages: Math.ceil(sorted.length / limit),
        },
    };
});
exports.getDailySalesService = getDailySalesService;
