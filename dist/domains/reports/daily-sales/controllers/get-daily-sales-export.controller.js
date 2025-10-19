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
exports.getDailySalesExportController = void 0;
const get_daily_sales_service_1 = require("../services/get-daily-sales.service");
const export_daily_sales_util_1 = require("../utils/export-daily-sales.util");
const getDailySalesExportController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil data harian dari service (tanpa pagination)
        const result = yield (0, get_daily_sales_service_1.getDailySalesService)(Object.assign(Object.assign({}, req.query), { page: 1, limit: 99999 }));
        const data = result.data || [];
        // Generate Excel file
        const buffer = yield (0, export_daily_sales_util_1.exportDailySalesToExcel)(data, req.query);
        const start = req.query.start || "start";
        const end = req.query.end || "end";
        const filename = `daily-sales-${start}-to-${end}.xlsx`;
        // Set header agar browser mengenali file sebagai Excel
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", buffer.byteLength.toString());
        // Kirim buffer sebagai binary file
        return res.end(Buffer.from(buffer));
    }
    catch (err) {
        next(err);
    }
});
exports.getDailySalesExportController = getDailySalesExportController;
