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
exports.endShiftService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const shift_repository_1 = require("../repositories/shift.repository");
const endShiftService = (cashierId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const shift = yield (0, shift_repository_1.findActiveShiftByCashier)(cashierId);
    if (!shift)
        throw new Error("No active shift found for this cashier");
    // ambil semua transaksi di shift ini
    const transactions = yield prisma_1.default.transaction.findMany({
        where: { shiftId: shift.id },
        include: { transactionItems: true },
    });
    // hitung totalCash
    const totalCash = transactions
        .filter((t) => t.paymentMethod === "CASH")
        .reduce((acc, t) => acc + Number(t.totalAmount), 0);
    // hitung totalDebit
    const totalDebit = transactions
        .filter((t) => t.paymentMethod === "DEBIT_CARD")
        .reduce((acc, t) => acc + Number(t.totalAmount), 0);
    // hitung totalTransactions
    const totalTransactions = transactions.length;
    // expectedBalance = openingBalance + totalCash
    const expectedBalance = Number(shift.openingBalance) + totalCash;
    // cashDifference = closingBalance - expectedBalance
    const cashDifference = data.closingBalance - expectedBalance;
    // update shift dengan closeShift
    const updatedShift = yield (0, shift_repository_1.closeShift)(shift.id, {
        closingBalance: data.closingBalance,
        totalCash,
        totalDebit,
        totalTransactions,
        cashDifference,
        closedAt: new Date(),
        status: "CLOSED",
    });
    return {
        shift: updatedShift,
        summary: {
            totalCash,
            totalDebit,
            totalTransactions,
            cashDifference,
        }
    };
});
exports.endShiftService = endShiftService;
