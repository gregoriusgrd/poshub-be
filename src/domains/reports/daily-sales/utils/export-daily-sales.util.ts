import ExcelJS from "exceljs";

export const exportDailySalesToExcel = async (data: any[], query: any) => {
  const workbook = new ExcelJS.Workbook();

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
  sheet2.lastRow!.font = { bold: true };

  // Lebar kolom
  const columnWidths = [16, 18, 20, 20, 20];
  sheet2.columns.forEach((col, i) => {
    col.width = columnWidths[i] || 18;
  });

  // Return sebagai buffer binary
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
