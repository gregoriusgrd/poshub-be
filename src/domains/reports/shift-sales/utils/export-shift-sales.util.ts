import ExcelJS from "exceljs";

export const exportShiftSalesToExcel = async (data: any[], query: any) => {
  const workbook = new ExcelJS.Workbook();

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
    sheet2.addRow([
      s.cashier,
      s.openedAt || "-",
      s.closedAt || "-",
      s.openingBalance,
      s.closingBalance ?? "-",
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
  sheet2.lastRow!.font = { bold: true };

  // Lebar kolom
  const columnWidths = [18, 14, 14, 16, 16, 16, 18, 18, 18, 12];
  sheet2.columns.forEach((col, i) => {
    col.width = columnWidths[i] || 16;
  });

  // Return buffer Excel valid
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
