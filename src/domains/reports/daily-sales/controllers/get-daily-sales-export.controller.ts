import { Request, Response, NextFunction } from "express";
import { getDailySalesService } from "../services/get-daily-sales.service";
import { exportDailySalesToExcel } from "../utils/export-daily-sales.util";

export const getDailySalesExportController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    // Ambil data harian dari service (tanpa pagination)
    const result = await getDailySalesService({
      ...req.query,
      page: 1,
      limit: 99999, // ambil semua data
    });

    const data = result.data || [];

    // Generate Excel file
    const buffer = await exportDailySalesToExcel(data, req.query);

    const start = req.query.start || "start";
    const end = req.query.end || "end";
    const filename = `daily-sales-${start}-to-${end}.xlsx`;

    // Set header agar browser mengenali file sebagai Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Content-Length", buffer.byteLength.toString());

    // Kirim buffer sebagai binary file
    return res.end(Buffer.from(buffer));
  } catch (err) {
    next(err);
  }
};
