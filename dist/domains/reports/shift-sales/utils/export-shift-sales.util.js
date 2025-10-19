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
exports.exportShiftSalesToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const exportShiftSalesToExcel = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook();
    // sheet 1 - SUMMARY
    const sheet1 = workbook.addWorksheet("Summary");
    const totalShifts = data.length;
    const totalTransactions = data.reduce((a, b) => a + (b.totalTransactions || 0), 0);
    const totalCash = data.reduce((a, b) => a + (b.totalCash || 0), 0);
    const totalDebit = data.reduce((a, b) => a + (b.totalDebit || 0), 0);
    const totalDifference = data.reduce((a, b) => a + (b.cashDifference || 0), 0);
    const avgPerShift = totalShifts ? (totalCash + totalDebit) / totalShifts : 0;
    const start = query.start || "start";
    const end = query.end || "end";
    // Tambahkan summary rows
    sheet1.addRows([
        ["Shift Sales Summary"],
        [],
        ["Period", `${start} - ${end}`],
        ["Total Shifts", totalShifts],
        ["Total Transactions", totalTransactions],
        ["Total Cash", totalCash],
        ["Total Debit", totalDebit],
        ["Total Cash Difference", totalDifference],
        ["Average / Shift", avgPerShift],
    ]);
    // Styling
    sheet1.getRow(1).font = { bold: true, size: 14 };
    sheet1.getColumn(1).width = 25; // kolom label
    sheet1.getColumn(2).width = 22; // kolom value
    // sheet 2 - RAW DATA
    const sheet2 = workbook.addWorksheet("Shift Report");
    // Header
    sheet2.addRow([
        "Cashier",
        "Opened At",
        "Closed At",
        "Opening Balance",
        "Closing Balance",
        "Transactions",
        "Cash",
        "Debit",
        "Cash Diff",
        "Status",
    ]);
    sheet2.getRow(1).font = { bold: true };
    // Data rows
    data.forEach((s) => {
        var _a;
        sheet2.addRow([
            s.cashier,
            s.openedAt || "-",
            s.closedAt || "-",
            s.openingBalance,
            (_a = s.closingBalance) !== null && _a !== void 0 ? _a : "-",
            s.totalTransactions,
            s.totalCash,
            s.totalDebit,
            s.cashDifference,
            s.status,
        ]);
    });
    // Baris total di bawah
    sheet2.addRow([]);
    sheet2.addRow([
        "TOTAL",
        "",
        "",
        "",
        "",
        totalTransactions,
        totalCash,
        totalDebit,
        totalDifference,
        "",
    ]);
    sheet2.lastRow.font = { bold: true };
    // Lebar kolom
    const columnWidths = [18, 14, 14, 16, 16, 16, 18, 18, 18, 12];
    sheet2.columns.forEach((col, i) => {
        col.width = columnWidths[i] || 16;
    });
    // Return buffer Excel valid
    const buffer = yield workbook.xlsx.writeBuffer();
    return buffer;
});
exports.exportShiftSalesToExcel = exportShiftSalesToExcel;
