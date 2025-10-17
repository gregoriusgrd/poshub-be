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
exports.getShiftSalesService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const pagination_util_1 = require("../../../core/utils/pagination.util");
/**
 * Menampilkan ringkasan shift kasir dalam periode tertentu
 */
const getShiftSalesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { start, end, cashierId, status, sortBy = "openedAt", order = "desc" } = query;
    // Date filter
    const dateFilter = {};
    if (start || end) {
        dateFilter.openedAt = {};
        if (start)
            dateFilter.openedAt.gte = new Date(start);
        if (end)
            dateFilter.openedAt.lte = new Date(end);
    }
    // Pagination
    const { page, limit, skip, take } = (0, pagination_util_1.getPagination)({
        page: Number(query.page),
        limit: Number(query.limit),
    });
    // Where clause
    const whereClause = Object.assign({}, dateFilter);
    if (cashierId)
        whereClause.cashierId = Number(cashierId);
    if (status)
        whereClause.status = status;
    // Query shifts
    const [shifts, total] = yield Promise.all([
        prisma_1.default.shift.findMany({
            where: whereClause,
            include: {
                cashier: { select: { id: true, fullName: true, username: true } },
            },
            orderBy: { [sortBy]: order },
            skip,
            take,
        }),
        prisma_1.default.shift.count({ where: whereClause }),
    ]);
    // Mapping hasil akhir
    const report = shifts.map((s) => ({
        id: s.id,
        cashier: s.cashier.fullName,
        cashierId: s.cashierId,
        openedAt: s.openedAt,
        closedAt: s.closedAt,
        openingBalance: Number(s.openingBalance),
        closingBalance: s.closingBalance ? Number(s.closingBalance) : null,
        totalTransactions: s.totalTransactions || 0,
        totalCash: s.totalCash ? Number(s.totalCash) : 0,
        totalDebit: s.totalDebit ? Number(s.totalDebit) : 0,
        cashDifference: s.cashDifference ? Number(s.cashDifference) : 0,
        status: s.status,
    }));
    // Final response
    return {
        data: report,
        meta: {
            page,
            limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getShiftSalesService = getShiftSalesService;
