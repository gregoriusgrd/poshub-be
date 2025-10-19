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
exports.getInconsistentShiftsExportController = void 0;
const get_inconsistent_shifts_service_1 = require("../services/get-inconsistent-shifts.service");
const export_inconsistent_shifts_util_1 = require("../utils/export-inconsistent-shifts.util");
const getInconsistentShiftsExportController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, get_inconsistent_shifts_service_1.getInconsistentShiftsService)(Object.assign(Object.assign({}, req.query), { page: 1, limit: 99999 }));
        const data = result.data || [];
        const buffer = yield (0, export_inconsistent_shifts_util_1.exportInconsistentShiftsToExcel)(data, req.query);
        const start = req.query.start || "start";
        const end = req.query.end || "end";
        const filename = `inconsistent-shifts-${start}-to-${end}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", buffer.byteLength.toString());
        return res.end(Buffer.from(buffer));
    }
    catch (err) {
        next(err);
    }
});
exports.getInconsistentShiftsExportController = getInconsistentShiftsExportController;
