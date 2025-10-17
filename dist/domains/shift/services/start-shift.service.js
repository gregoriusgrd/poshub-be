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
exports.startShiftService = void 0;
const http_error_1 = require("../../../core/errors/http-error");
const shift_repository_1 = require("../repositories/shift.repository");
const startShiftService = (cashierId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingShift = yield (0, shift_repository_1.findActiveShiftByCashier)(cashierId);
    if (existingShift)
        throw (0, http_error_1.badRequest)("You already have an active shift");
    const newShift = yield (0, shift_repository_1.createShift)(cashierId, data.openingBalance);
    return newShift;
});
exports.startShiftService = startShiftService;
