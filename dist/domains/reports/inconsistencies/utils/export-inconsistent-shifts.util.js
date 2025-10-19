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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportInconsistentShiftsToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const date_fns_1 = require("date-fns");
// Utility to export inconsistent shifts data to Excel
const exportInconsistentShiftsToExcel = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook();
    // sheet 1 - SUMMARY
    const sheet1 = workbook.addWorksheet("Summary");
    const totalInconsistent = data.length;
    const totalDifference = data.reduce((a, b) => a + Math.abs(b.difference || 0), 0);
    const avgDifference = totalInconsistent > 0 ? totalDifference / totalInconsistent : 0;
    const highestDiff = data.length > 0
        ? data.reduce((max, cur) => Math.abs(cur.difference) > Math.abs(max.difference) ? cur : max)
        : null;
    const start = query.start || "start";
    const end = query.end || "end";
    sheet1.addRows([
        ["Inconsistent Shifts Summary"],
        [],
        ["Period", `${start} - ${end}`],
        ["Total Inconsistent Shifts", totalInconsistent],
        ["Total Absolute Difference", totalDifference],
        ["Average Difference", avgDifference],
        [
            "Highest Difference",
            highestDiff
                ? `${highestDiff.cashierName} — Rp ${Intl.NumberFormat("id-ID").format(highestDiff.difference)}`
                : "-",
        ],
    ]);
    // Styling
    sheet1.getRow(1).font = { bold: true, size: 14 };
    sheet1.getColumn(1).width = 28;
    sheet1.getColumn(2).width = 24;
    // sheet 2 - RAW DATA
    const sheet2 = workbook.addWorksheet("Inconsistent Shifts");
    // Header
    sheet2.addRow([
        "Cashier",
        "Opened At",
        "Closed At",
        "Opening Balance",
        "Total Cash",
        "Expected Closing",
        "Closing Balance",
        "Difference",
        "Status",
    ]);
    sheet2.getRow(1).font = { bold: true };
    // Data
    data.forEach((s) => {
        sheet2.addRow([
            s.cashierName,
            s.openedAt ? (0, date_fns_1.format)(new Date(s.openedAt), "dd MMM yyyy HH:mm") : "-",
            s.closedAt ? (0, date_fns_1.format)(new Date(s.closedAt), "dd MMM yyyy HH:mm") : "-",
            s.openingBalance,
            s.totalCash,
            s.expectedClosing,
            s.closingBalance,
            s.difference,
            s.status,
        ]);
    });
    // Total baris terakhir
    sheet2.addRow([]);
    sheet2.addRow([
        "TOTAL",
        "",
        "",
        "",
        "",
        "",
        "",
        totalDifference,
        "",
    ]);
    sheet2.lastRow.font = { bold: true };
    // Lebar kolom
    const columnWidths = [18, 14, 14, 18, 18, 18, 18, 16, 12];
    sheet2.columns.forEach((col, i) => {
        col.width = columnWidths[i] || 16;
    });
    // Return valid buffer Excel
    const buffer = yield workbook.xlsx.writeBuffer();
    return buffer;
});
exports.exportInconsistentShiftsToExcel = exportInconsistentShiftsToExcel;
