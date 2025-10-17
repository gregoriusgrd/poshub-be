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
exports.startShiftController = void 0;
const start_shift_service_1 = require("../services/start-shift.service");
const logger_1 = require("../../../config/logger");
const startShiftController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info("Start shift controller called");
        const cashierId = req.user.userId;
        logger_1.logger.info(`Cashier ID: ${cashierId}`);
        const data = req.body;
        const shift = yield (0, start_shift_service_1.startShiftService)(cashierId, data);
        logger_1.logger.info(`Shift started successfully: ${JSON.stringify(shift)}`);
        return res.status(201).json({
            success: true,
            message: "Shift started successfully",
            data: shift,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.startShiftController = startShiftController;
