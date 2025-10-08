import prisma from "../../../config/prisma";
import { TransactionItemDTO } from "../dto/transaction.dto";

// Create a new transaction
export const createTransaction = (shiftId: number, cashierId: number, totalAmount: number, paymentMethod: "CASH" | "DEBIT_CARD") => {
    return prisma.transaction.create({
        data: {
            shiftId,
            cashierId,
            totalAmount,
            paymentMethod
        }
    });
};

// Create transaction items
export const createTransactionItems = (transactionId: number, items: TransactionItemDTO[]) => {
    const data = items.map(item => ({
        transactionId,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal ?? 0,
    }));
    return prisma.transactionItem.createMany({ data });
};

// Get transactions by shift ID
export const getTransactionByShift = (shiftId: number) => {
    return prisma.transaction.findMany({
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
    })
}