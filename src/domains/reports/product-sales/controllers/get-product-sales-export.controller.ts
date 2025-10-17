import { Request, Response, NextFunction } from "express";
import { getProductSalesService } from "../services/get-product-sales.service";
import { exportProductSalesToExcel } from "../utils/export-product-sales.util";

export const getProductSalesExportController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const result = await getProductSalesService({
      ...req.query,
      page: 1,
      limit: 99999, // ambil semua data
    });

    const data = result.data || [];
    const buffer = await exportProductSalesToExcel(data, req.query);

    const start = req.query.start || "start";
    const end = req.query.end || "end";
    const filename = `product-sales-${start}-to-${end}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Content-Length", buffer.byteLength.toString());

    // kirim buffer agar tidak korup
    return res.end(Buffer.from(buffer));
  } catch (err) {
    next(err);
  }
};
