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
exports.createTransactionService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const http_error_1 = require("../../../core/errors/http-error");
const transaction_code_util_1 = require("../../../core/utils/transaction-code.util");
const createTransactionService = (cashierId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { shiftId, items, paymentAmount, paymentMethod } = data;
    // 1. Validasi shift
    const shift = yield prisma_1.default.shift.findUnique({ where: { id: shiftId } });
    if (!shift)
        throw (0, http_error_1.notFound)("Shift not found");
    if (shift.status !== "OPEN")
        throw (0, http_error_1.badRequest)("Cannot create transaction: shift is closed");
    if (items.length === 0)
        throw (0, http_error_1.badRequest)("Transaction must have at least one item");
    // 2. Ambil produk yg dibeli
    const productIds = items.map((item) => item.productId);
    const products = yield prisma_1.default.product.findMany({
        where: { id: { in: productIds }, isDeleted: false },
    });
    if (products.length !== items.length)
        throw (0, http_error_1.notFound)("One or more products not found");
    // 3. Hitung subtotal tiap item & totalAmount
    const itemsWithSubtotal = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product.stock < item.quantity) {
            throw (0, http_error_1.badRequest)(`Insufficient stock for product ${product.name}`);
        }
        return Object.assign(Object.assign({}, item), { subtotal: item.quantity * product.price });
    });
    const totalAmount = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);
    // 4a. Validasi pembayaran cash
    if (paymentMethod === "CASH" && paymentAmount < totalAmount) {
        throw (0, http_error_1.badRequest)("Cash payment is less than total amount");
    }
    const changeAmount = paymentMethod === "CASH" ? paymentAmount - totalAmount : 0;
    // 4b. Validasi pembayaran debit
    if (paymentMethod === "DEBIT_CARD") {
        if (!data.cardNumber || !data.cardExpiry || !data.cardCvv) {
            throw (0, http_error_1.badRequest)("Card number, expiry date, and CVV are required for debit card payment");
        }
        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumberRegex.test(data.cardNumber)) {
            throw (0, http_error_1.badRequest)("Invalid card number. Must be 16 digits.");
        }
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(data.cardExpiry)) {
            throw (0, http_error_1.badRequest)("Invalid expiry date format. Use MM/YY");
        }
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(data.cardCvv)) {
            throw (0, http_error_1.badRequest)("Invalid CVV. Must be 3 digits.");
        }
        if (paymentAmount !== totalAmount) {
            throw (0, http_error_1.badRequest)("Debit card payment amount must equal total amount");
        }
    }
    // 5. Generate transaction code
    const transactionCode = (0, transaction_code_util_1.generateTransactionCode)();
    // 6. Simpan transaksi dan transactionItems secara atomic
    const transaction = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // buat transaksi pakai repository
        const createdTransaction = yield tx.transaction.create({
            data: {
                transactionCode,
                cashierId,
                shiftId,
                totalAmount,
                paymentAmount,
                changeAmount,
                paymentMethod,
            },
        });
        // buat transaction items
        yield tx.transactionItem.createMany({
            data: itemsWithSubtotal.map((item) => ({
                transactionId: createdTransaction.id,
                productId: item.productId,
                quantity: item.quantity,
                subtotal: item.subtotal,
            })),
        });
        // update stock produk
        for (const item of itemsWithSubtotal) {
            yield tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        return createdTransaction;
    }));
    return transaction;
});
exports.createTransactionService = createTransactionService;
