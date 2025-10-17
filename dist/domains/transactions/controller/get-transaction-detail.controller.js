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
exports.getTransactionDetailController = void 0;
const http_error_1 = require("../../../core/errors/http-error");
const get_transaction_detail_service_1 = require("../services/get-transaction-detail.service");
const logger_1 = require("../../../config/logger");
const getTransactionDetailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId } = req.params;
        logger_1.logger.info("Get transaction detail controller called");
        if (!transactionId)
            throw (0, http_error_1.badRequest)("Transaction ID is required");
        const user = {
            id: req.user.userId,
            role: req.user.role,
        };
        const detail = yield (0, get_transaction_detail_service_1.getTransactionDetailService)(Number(transactionId), user);
        logger_1.logger.info(`Transaction detail retrieved successfully: ${JSON.stringify(detail)}`);
        return res.status(200).json({
            success: true,
            message: "Transaction detail retrieved successfully",
            data: detail,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTransactionDetailController = getTransactionDetailController;
