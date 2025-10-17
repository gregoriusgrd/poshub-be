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
exports.getActiveShiftController = void 0;
const shift_repository_1 = require("../repositories/shift.repository");
const logger_1 = require("../../../config/logger");
const getActiveShiftController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info("Get active shift controller called");
        const cashierId = req.user.userId;
        const shift = yield (0, shift_repository_1.findActiveShiftByCashier)(cashierId);
        logger_1.logger.info(`Active shift for cashier ID ${cashierId}: ${JSON.stringify(shift)}`);
        return res.status(200).json({
            success: true,
            message: shift ? "Active shift found" : "No active shift",
            data: shift,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getActiveShiftController = getActiveShiftController;
