import { Request, Response, NextFunction } from "express";
import { getInconsistentShiftsService } from "../services/get-inconsistent-shifts.service";
import { exportInconsistentShiftsToExcel } from "../utils/export-inconsistent-shifts.util";

export const getInconsistentShiftsExportController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const result = await getInconsistentShiftsService({
      ...req.query,
      page: 1,
      limit: 99999,
    });

    const data = result.data || [];
    const buffer = await exportInconsistentShiftsToExcel(data, req.query);

    const start = req.query.start || "start";
    const end = req.query.end || "end";
    const filename = `inconsistent-shifts-${start}-to-${end}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Content-Length", buffer.byteLength.toString());

    return res.end(Buffer.from(buffer));
  } catch (err) {
    next(err);
  }
};
