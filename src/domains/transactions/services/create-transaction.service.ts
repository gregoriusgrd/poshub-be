import prisma from "../../../config/prisma";
import { badRequest, notFound } from "../../../core/errors/http-error";
import { generateTransactionCode } from "../../../core/utils/transaction-code.util";
import { CreateTransactionDTO, TransactionItemDTO } from "../dto/transaction.dto";

export const createTransactionService = async ( cashierId: number, data: CreateTransactionDTO ) => {
  const { shiftId, items, paymentAmount, paymentMethod } = data;

  // 1. Validasi shift
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift) throw notFound("Shift not found");
  if (shift.status !== "OPEN")
    throw badRequest("Cannot create transaction: shift is closed");

  if (items.length === 0)
    throw badRequest("Transaction must have at least one item");

  // 2. Ambil produk yg dibeli
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isDeleted: false },
  });

  if (products.length !== items.length)
    throw notFound("One or more products not found");

  // 3. Hitung subtotal tiap item & totalAmount
  const itemsWithSubtotal: (TransactionItemDTO & { subtotal: number })[] = items.map((item) => {
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

  // 4a. Validasi pembayaran cash
  if (paymentMethod === "CASH" && paymentAmount < totalAmount) {
    throw badRequest("Cash payment is less than total amount");
  }

  const changeAmount = paymentMethod === "CASH" ? paymentAmount - totalAmount : 0;

  // 4b. Validasi pembayaran debit
  if (paymentMethod === "DEBIT_CARD") {
    if (!data.cardNumber || !data.cardExpiry || !data.cardCvv) {
      throw badRequest("Card number, expiry date, and CVV are required for debit card payment");
    }

    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(data.cardNumber)) {
      throw badRequest("Invalid card number. Must be 16 digits.");
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(data.cardExpiry)) {
      throw badRequest("Invalid expiry date format. Use MM/YY");
    }

    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(data.cardCvv)) {
      throw badRequest("Invalid CVV. Must be 3 digits.");
    }

    if (paymentAmount !== totalAmount) {
      throw badRequest("Debit card payment amount must equal total amount");
    }
  }

  // 5. Generate transaction code
  const transactionCode = generateTransactionCode();

  // 6. Simpan transaksi dan transactionItems secara atomic
  const transaction = await prisma.$transaction(async (tx) => {

    // buat transaksi pakai repository
    const createdTransaction = await tx.transaction.create({
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
