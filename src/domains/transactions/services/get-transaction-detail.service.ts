import prisma from "../../../config/prisma";
import { forbidden, notFound } from "../../../core/errors/http-error";

export const getTransactionDetailService = async (
    transactionId: number, 
    user: {id: number; role: "ADMIN" | "CASHIER"}
) => {
    const transaction = await prisma.transaction.findUnique({
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
    })

    if (!transaction) throw notFound("Transaction not found");

    // kasir hanya boleh akses transaksi dia sendiri
    if (user.role === "CASHIER" && transaction.cashierId !== user.id) {
        throw forbidden("Access denied to this transaction");
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
}