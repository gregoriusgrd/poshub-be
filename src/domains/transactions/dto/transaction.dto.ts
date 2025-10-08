export interface TransactionItemDTO {
    productId: number;
    quantity: number;
    subtotal?: number;
}

export interface CreateTransactionDTO {
    shiftId: number;
    items: TransactionItemDTO[];
    paymentAmount: number;
    paymentMethod: "CASH" | "DEBIT_CARD";
}