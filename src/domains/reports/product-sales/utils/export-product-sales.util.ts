import ExcelJS from "exceljs";

// Utility to export product sales data to Excel

export const exportProductSalesToExcel = async (data: any[], query: any) => {
  const workbook = new ExcelJS.Workbook();

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
  sheet2.lastRow!.font = { bold: true };

  // Lebar kolom
  const columnWidths = [28, 22, 16, 16, 18];
  sheet2.columns.forEach((col, i) => {
    col.width = columnWidths[i] || 18;
  });

  // Return buffer Excel valid
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
