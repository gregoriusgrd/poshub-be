"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../domains/auth/routes/auth.route"));
const cashier_route_1 = __importDefault(require("../domains/cashier/routes/cashier.route"));
const product_route_1 = __importDefault(require("../domains/product/routes/product.route"));
const category_route_1 = __importDefault(require("../domains/category/routes/category.route"));
const shift_route_1 = __importDefault(require("../domains/shift/routes/shift.route"));
const transaction_route_1 = __importDefault(require("../domains/transactions/routes/transaction.route"));
const report_route_1 = __importDefault(require("../domains/reports/routes/report.route"));
const router = (0, express_1.Router)();
// Example route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});
// Auth routes
router.use("/auth", auth_route_1.default);
// Cashier routes
router.use("/cashiers", cashier_route_1.default);
// Product routes
router.use("/products", product_route_1.default);
// Category routes
router.use("/categories", category_route_1.default);
// Shift routes
router.use("/shifts", shift_route_1.default);
// Transaction routes
router.use("/transactions", transaction_route_1.default);
// Report routes
router.use("/reports", report_route_1.default);
exports.default = router;
