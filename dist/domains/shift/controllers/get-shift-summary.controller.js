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
exports.getShiftSummaryController = void 0;
const shift_repository_1 = require("../repositories/shift.repository");
const getShiftSummaryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shiftId = Number(req.params.id);
        const shift = yield (0, shift_repository_1.getShiftSummary)(shiftId);
        if (!shift) {
            return res.status(404).json({
                success: false,
                message: "Shift not found",
            });
        }
        ;
        return res.status(200).json({
            success: true,
            message: "Shift summary retrieved successfully",
            data: shift,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getShiftSummaryController = getShiftSummaryController;
