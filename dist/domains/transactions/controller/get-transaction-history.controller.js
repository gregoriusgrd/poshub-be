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
exports.getTransactionHistoryController = void 0;
const get_transaction_history_service_1 = require("../services/get-transaction-history.service");
const logger_1 = require("../../../config/logger");
const getTransactionHistoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info("Get transaction history controller called");
        const cashierId = req.user.userId;
        const role = req.user.role;
        const { page, limit, search } = req.query;
        const history = yield (0, get_transaction_history_service_1.getTransactionHistoryService)({
            page: Number(page),
            limit: Number(limit),
            search: String(search || ""),
            cashierId,
            role,
        });
        logger_1.logger.info(`Transaction history retrieved successfully: ${JSON.stringify(history)}`);
        return res.status(200).json({
            success: true,
            message: "Transaction history retrieved successfully",
            data: history,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTransactionHistoryController = getTransactionHistoryController;
