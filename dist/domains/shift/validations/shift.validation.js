"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endShiftSchema = exports.startShiftSchema = void 0;
const zod_1 = require("zod");
exports.startShiftSchema = zod_1.z.object({
    openingBalance: zod_1.z.number().min(0, "Opening balance must be at least 0"),
});
exports.endShiftSchema = zod_1.z.object({
    closingBalance: zod_1.z.number().min(0, "Closing balance must be at least 0"),
});
