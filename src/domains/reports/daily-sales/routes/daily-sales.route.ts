import { Router } from "express";
import { getDailySalesController } from "../controllers/get-daily-sales.controller";
import { getDailySalesExportController } from "../controllers/get-daily-sales-export.controller";

const router = Router();

router.get("/", getDailySalesController);
router.get("/export", getDailySalesExportController);

export default router;