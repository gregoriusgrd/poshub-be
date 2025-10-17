"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionByShift = exports.createTransactionItems = exports.createTransaction = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
// Create a new transaction
const createTransaction = (shiftId, cashierId, totalAmount, paymentAmount, changeAmount, paymentMethod, transactionCode) => {
    return prisma_1.default.transaction.create({
        data: {
            transactionCode,
            shiftId,
            cashierId,
            totalAmount,
            paymentAmount,
            changeAmount,
            paymentMethod,
        }
    });
};
exports.createTransaction = createTransaction;
// Create transaction items
const createTransactionItems = (transactionId, items) => {
    const data = items.map(item => {
        var _a;
        return ({
            transactionId,
            productId: item.productId,
            quantity: item.quantity,
            subtotal: (_a = item.subtotal) !== null && _a !== void 0 ? _a : 0,
        });
    });
    return prisma_1.default.transactionItem.createMany({ data });
};
exports.createTransactionItems = createTransactionItems;
// Get transactions by shift ID
const getTransactionByShift = (shiftId) => {
    return prisma_1.default.transaction.findMany({
        where: { shiftId },
        include: {
            transactionItems: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true
                        }
                    }
                }
            }
        }
    });
};
exports.getTransactionByShift = getTransactionByShift;
