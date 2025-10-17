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
exports.getShiftSummary = exports.closeShift = exports.createShift = exports.findActiveShiftByCashier = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const findActiveShiftByCashier = (cashierId) => {
    return prisma_1.default.shift.findFirst({
        where: { cashierId, status: "OPEN" },
        include: {
            cashier: { select: { id: true, fullName: true } },
        },
    });
};
exports.findActiveShiftByCashier = findActiveShiftByCashier;
// Mulai shift (openingBalance di pass dari service)
const createShift = (cashierId, openingBalance) => {
    return prisma_1.default.shift.create({
        data: { cashierId, openingBalance },
    });
};
exports.createShift = createShift;
/**
 * Tutup shift: terima payload ini (bukan hanya closingBalance)
 * service menghitung totalCash, totalDebit, totalTransactions, cashDifference
 * lalu panggil repository ini untuk update shift
 */
const closeShift = (shiftId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updateData = {
        closingBalance: payload.closingBalance,
        status: (_a = payload.status) !== null && _a !== void 0 ? _a : "CLOSED",
        closedAt: (_b = payload.closedAt) !== null && _b !== void 0 ? _b : new Date(),
    };
    if (payload.totalCash !== undefined)
        updateData.totalCash = payload.totalCash;
    if (payload.totalDebit !== undefined)
        updateData.totalDebit = payload.totalDebit;
    if (payload.totalTransactions !== undefined)
        updateData.totalTransactions = payload.totalTransactions;
    if (payload.cashDifference !== undefined)
        updateData.cashDifference = payload.cashDifference;
    return prisma_1.default.shift.update({
        where: { id: shiftId },
        data: updateData,
    });
});
exports.closeShift = closeShift;
const getShiftSummary = (shiftId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.shift.findUnique({
        where: { id: shiftId },
        include: {
            cashier: {
                select: { id: true, fullName: true, username: true },
            },
            transactions: {
                include: {
                    transactionItems: {
                        include: {
                            product: {
                                select: { id: true, name: true, price: true },
                            },
                        },
                    },
                },
                orderBy: { transactionTime: "desc" },
            },
        },
    });
});
exports.getShiftSummary = getShiftSummary;
