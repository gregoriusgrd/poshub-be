import prisma from "../../../config/prisma";
import { notFound } from "../../../core/errors/http-error";

export const getTransactionDetailService = async (transactioId: number) => {
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactioId },
        include: {
            cashier: {
                select: { id: true, fullName: true, username: true }
            },
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

    return transaction;
}