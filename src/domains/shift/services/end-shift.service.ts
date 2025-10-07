import prisma from "../../../config/prisma";
import { EndShiftDTO } from "../dto/shift.dto";
import { closeShift, findActiveShiftByCashier } from "../repositories/shift.repository";

export const endShiftService = async (cashierId: number, data: EndShiftDTO) => {
    const shift = await findActiveShiftByCashier(cashierId);
    if (!shift) throw new Error("No active shift found for this cashier");

    // ambil semua transaksi di shift ini
    const transactions = await prisma.transaction.findMany({
        where: { shiftId: shift.id },
        include: { transactionItems: true },
    })

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
    const updatedShift = await closeShift(shift.id, {
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
    }

}