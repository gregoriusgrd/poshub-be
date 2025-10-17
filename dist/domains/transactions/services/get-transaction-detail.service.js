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
exports.getTransactionDetailService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const http_error_1 = require("../../../core/errors/http-error");
const getTransactionDetailService = (transactionId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield prisma_1.default.transaction.findUnique({
        where: { id: transactionId },
        include: {
            cashier: { select: { id: true, fullName: true, username: true } },
            shift: { select: { id: true, openedAt: true, closedAt: true } },
            transactionItems: {
                include: {
                    product: {
                        select: { id: true, name: true, price: true }
                    }
                }
            }
        }
    });
    if (!transaction)
        throw (0, http_error_1.notFound)("Transaction not found");
    // kasir hanya boleh akses transaksi dia sendiri
    if (user.role === "CASHIER" && transaction.cashierId !== user.id) {
        throw (0, http_error_1.forbidden)("Access denied to this transaction");
    }
    return {
        id: transaction.id,
        transactionCode: transaction.transactionCode,
        totalAmount: transaction.totalAmount,
        paymentAmount: transaction.paymentAmount,
        changeAmount: transaction.changeAmount,
        paymentMethod: transaction.paymentMethod,
        transactionTime: transaction.transactionTime,
        cashier: transaction.cashier,
        shift: transaction.shift,
        items: transaction.transactionItems.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            subtotal: i.subtotal,
        })),
    };
});
exports.getTransactionDetailService = getTransactionDetailService;
