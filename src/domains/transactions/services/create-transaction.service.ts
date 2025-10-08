import prisma from "../../../config/prisma";
import { badRequest, notFound } from "../../../core/errors/http-error";
import { CreateTransactionDTO, TransactionItemDTO } from "../dto/transaction.dto";

export const createTransactionService = async ( cashierId: number, data: CreateTransactionDTO ) => {
  const { shiftId, items, paymentAmount, paymentMethod } = data;

  if (items.length === 0)
    throw badRequest("Transaction must have at least one item");

// 1. Ambil produk yg dibeli
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isDeleted: false },
  });

  if (products.length !== items.length)
    throw notFound("One or more products not found");

  // 2. Hitung subtotal tiap item & totalAmount
  const itemsWithSubtotal: (TransactionItemDTO & { subtotal: number })[] =
    items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw badRequest(`Insufficient stock for product ${product.name}`);
      }
      return {
        ...item,
        subtotal: item.quantity * product.price,
      };
    });

  const totalAmount = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);

  // 3. Validasi pembayaran cash
  if (paymentMethod === "CASH" && paymentAmount < totalAmount) {
    throw badRequest("Cash payment is less than total amount");
  }

  // 4. Simpan transaksi dan transactionItems secara atomic
  const transaction = await prisma.$transaction(async (tx) => {

    // buat transaksi
    const createdTransaction = await tx.transaction.create({
      data: {
        cashierId,
        shiftId,
        totalAmount,
        paymentMethod,
      },
    });

    // buat transaction items
    await tx.transactionItem.createMany({
      data: itemsWithSubtotal.map((item) => ({
        transactionId: createdTransaction.id,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    });

    // update stock produk
    for (const item of itemsWithSubtotal) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return createdTransaction;
  });

  return transaction;
};
