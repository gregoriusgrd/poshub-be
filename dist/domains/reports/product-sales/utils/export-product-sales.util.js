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
exports.exportProductSalesToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
// Utility to export product sales data to Excel
const exportProductSalesToExcel = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook();
    // sheet 1 - SUMMARY
    const sheet1 = workbook.addWorksheet("Summary");
    const totalProducts = data.length;
    const totalSold = data.reduce((a, b) => a + (b.totalSold || 0), 0);
    const totalRevenue = data.reduce((a, b) => a + (b.totalRevenue || 0), 0);
    const avgRevenue = totalProducts > 0 ? totalRevenue / totalProducts : 0;
    const start = query.start || "start";
    const end = query.end || "end";
    // Summary data
    sheet1.addRows([
        ["Product Sales Summary"],
        [],
        ["Period", `${start} - ${end}`],
        ["Total Products", totalProducts],
        ["Total Units Sold", totalSold],
        ["Total Revenue", totalRevenue],
        ["Average Revenue / Product", avgRevenue],
    ]);
    // Style
    sheet1.getRow(1).font = { bold: true, size: 14 };
    sheet1.getColumn(1).width = 25;
    sheet1.getColumn(2).width = 22;
    // sheet 2 - RAW DATA
    const sheet2 = workbook.addWorksheet("Product Report");
    // Header
    sheet2.addRow([
        "Product Name",
        "Category",
        "Price",
        "Units Sold",
        "Total Revenue",
    ]);
    sheet2.getRow(1).font = { bold: true };
    // Data rows
    data.forEach((p) => {
        sheet2.addRow([
            p.name,
            p.category || "-",
            p.price,
            p.totalSold,
            p.totalRevenue,
        ]);
    });
    // Baris total di bawah
    sheet2.addRow([]);
    sheet2.addRow([
        "TOTAL",
        "",
        "",
        totalSold,
        totalRevenue,
    ]);
    sheet2.lastRow.font = { bold: true };
    // Lebar kolom
    const columnWidths = [28, 22, 16, 16, 18];
    sheet2.columns.forEach((col, i) => {
        col.width = columnWidths[i] || 18;
    });
    // Return buffer Excel valid
    const buffer = yield workbook.xlsx.writeBuffer();
    return buffer;
});
exports.exportProductSalesToExcel = exportProductSalesToExcel;
