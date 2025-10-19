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
exports.getInconsistentShiftsService = void 0;
const prisma_1 = __importDefault(require("../../../../config/prisma"));
const pagination_util_1 = require("../../../../core/utils/pagination.util");
const sort_util_1 = require("../../../../core/utils/sort.util");
/**
 * Menampilkan shift kasir yang memiliki ketidaksesuaian saldo (inconsistencies)
 * - expectedClosing = openingBalance + totalCash
 * - difference = closingBalance - expectedClosing
 * - jika difference ≠ 0 maka shift dianggap bermasalah
 */
const getInconsistentShiftsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, cashierId, search, start, end, minDiff = 0, sortBy = "closedAt", order = "desc", } = query;
    const { skip, take } = (0, pagination_util_1.getPagination)({ page, limit });
    // Gabungkan semua filter dalam satu array AND
    const whereClause = {
        AND: [
            { status: "CLOSED" },
            cashierId ? { cashierId: Number(cashierId) } : {},
            start && end
                ? {
                    closedAt: {
                        gte: new Date(start),
                        lte: new Date(end),
                    },
                }
                : {},
            search
                ? {
                    cashier: {
                        fullName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                }
                : {},
        ],
    };
    // Ambil data dari DB
    const shifts = yield prisma_1.default.shift.findMany({
        where: whereClause,
        include: {
            cashier: { select: { id: true, fullName: true, username: true } },
        },
        orderBy: ["closedAt", "openedAt"].includes(sortBy) && order
            ? { [sortBy]: order }
            : undefined,
    });
    // Proses perhitungan expectedClosing & difference
    let inconsistent = shifts
        .map((s) => {
        const opening = Number(s.openingBalance || 0);
        const closing = Number(s.closingBalance || 0);
        const totalCash = Number(s.totalCash || 0);
        const totalDebit = Number(s.totalDebit || 0);
        const expectedClosing = opening + totalCash;
        const difference = closing - expectedClosing;
        return {
            id: s.id,
            cashierId: s.cashierId,
            cashierName: s.cashier.fullName,
            openedAt: s.openedAt,
            closedAt: s.closedAt,
            openingBalance: opening,
            closingBalance: closing,
            totalCash,
            totalDebit,
            expectedClosing,
            difference,
            status: s.status,
        };
    })
        .filter((shift) => Math.abs(shift.difference) > Number(minDiff));
    // Sort manual kalau kolomnya bukan kolom Prisma
    if (["difference", "expectedClosing"].includes(sortBy)) {
        inconsistent = (0, sort_util_1.sortByNumericField)(inconsistent, sortBy, order);
    }
    // Pagination manual
    const paginated = inconsistent.slice(skip, skip + take);
    // Final response
    return {
        data: paginated,
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalItems: inconsistent.length,
            totalPages: Math.ceil(inconsistent.length / limit),
        },
    };
});
exports.getInconsistentShiftsService = getInconsistentShiftsService;
