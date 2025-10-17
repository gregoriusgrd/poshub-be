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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionController = void 0;
const create_transaction_service_1 = require("../services/create-transaction.service");
const transaction_validation_1 = require("../validations/transaction.validation");
const logger_1 = require("../../../config/logger");
const createTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validasi body dengan zod schema
        logger_1.logger.info("Create transaction controller called");
        const data = transaction_validation_1.createTransactionSchema.parse(req.body);
        // ambil userId dari JWT payload
        const cashierId = req.user.userId; // dari auth middleware
        logger_1.logger.info(`Cashier ID: ${cashierId}, Data: ${JSON.stringify(data)}`);
        // panggil service untuk buat transaksi
        const transaction = yield (0, create_transaction_service_1.createTransactionService)(cashierId, data);
        logger_1.logger.info(`Transaction created successfully: ${JSON.stringify(transaction)}`);
        console.log("🔥 [DEBUG] req.body received:", req.body);
        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createTransactionController = createTransactionController;
