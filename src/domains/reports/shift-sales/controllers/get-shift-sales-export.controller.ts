import { Request, Response, NextFunction } from "express";
import { getShiftSalesService } from "../services/get-shift-sales.service";
import { exportShiftSalesToExcel } from "../utils/export-shift-sales.util";

export const getShiftSalesExportController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    // Ambil semua data tanpa pagination
    const result = await getShiftSalesService({
      ...req.query,
      page: 1,
      limit: 99999,
    });

    const data = result.data || [];
    const buffer = await exportShiftSalesToExcel(data, req.query);

    const start = req.query.start || "start";
    const end = req.query.end || "end";
    const filename = `shift-sales-${start}-to-${end}.xlsx`;

    // Set header Excel yang benar
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Content-Length", buffer.byteLength.toString());

    // Kirim buffer sebagai binary
    return res.end(Buffer.from(buffer));
  } catch (err) {
    next(err);
  }
};
