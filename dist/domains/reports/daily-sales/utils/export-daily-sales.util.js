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
exports.exportDailySalesToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const exportDailySalesToExcel = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook();
    // sheet 1 - SUMMARY
    const sheet1 = workbook.addWorksheet("Summary");
    const totalTransactions = data.reduce((a, b) => a + (b.totalTransactions || 0), 0);
    const totalRevenue = data.reduce((a, b) => a + (b.totalRevenue || 0), 0);
    const totalCash = data.reduce((a, b) => a + (b.totalCash || 0), 0);
    const totalDebit = data.reduce((a, b) => a + (b.totalDebit || 0), 0);
    const avgPerDay = data.length ? totalRevenue / data.length : 0;
    const start = query.start || "start";
    const end = query.end || "end";
    // Tambahkan data summary
    sheet1.addRows([
        ["Daily Sales Summary"],
        [],
        ["Period", `${start} - ${end}`],
        ["Total Transactions", totalTransactions],
        ["Total Revenue", totalRevenue],
        ["Total Cash", totalCash],
        ["Total Debit", totalDebit],
        ["Average per Day", avgPerDay],
    ]);
    // Styling
    sheet1.getRow(1).font = { bold: true, size: 14 };
    sheet1.getColumn(1).width = 25;
    sheet1.getColumn(2).width = 22;
    // sheet 2 - RAW DATA
    const sheet2 = workbook.addWorksheet("Daily Data");
    // Header
    sheet2.addRow(["Date", "Transactions", "Revenue", "Cash", "Debit"]);
    sheet2.getRow(1).font = { bold: true };
    // Data
    data.forEach((row) => {
        sheet2.addRow([
            row.date,
            row.totalTransactions,
            row.totalRevenue,
            row.totalCash,
            row.totalDebit,
        ]);
    });
    // Baris total di bawah
    sheet2.addRow([]);
    sheet2.addRow([
        "TOTAL",
        totalTransactions,
        totalRevenue,
        totalCash,
        totalDebit,
    ]);
    sheet2.lastRow.font = { bold: true };
    // Lebar kolom
    const columnWidths = [16, 18, 20, 20, 20];
    sheet2.columns.forEach((col, i) => {
        col.width = columnWidths[i] || 18;
    });
    // Return sebagai buffer binary
    const buffer = yield workbook.xlsx.writeBuffer();
    return buffer;
});
exports.exportDailySalesToExcel = exportDailySalesToExcel;
