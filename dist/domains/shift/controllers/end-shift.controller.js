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
exports.endShiftController = void 0;
const end_shift_service_1 = require("../services/end-shift.service");
const logger_1 = require("../../../config/logger");
const endShiftController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info("End shift controller called");
        const cashierId = req.user.userId;
        const data = req.body;
        logger_1.logger.info(`Cashier ID: ${cashierId}, Data: ${JSON.stringify(data)}`);
        const result = yield (0, end_shift_service_1.endShiftService)(cashierId, data);
        logger_1.logger.info(`Shift ended successfully: ${JSON.stringify(result)}`);
        return res.status(201).json({
            success: true,
            message: "Shift ended successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.endShiftController = endShiftController;
