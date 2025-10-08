import { Router } from "express";
import authRoutes from "../domains/auth/routes/auth.route";
import cashierRoutes from "../domains/cashier/routes/cashier.route";
import productRoutes from "../domains/product/routes/product.route";
import categoryRoutes from "../domains/category/routes/category.route";
import shiftRoutes from "../domains/shift/routes/shift.route";
import transactionRoutes from "../domains/transactions/routes/transaction.route";

const router = Router();

// Example route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" })
})

// Auth routes
router.use("/auth", authRoutes);

// Cashier routes
router.use("/cashiers", cashierRoutes);

// Product routes
router.use("/products", productRoutes);

// Category routes
router.use("/categories", categoryRoutes);

// Shift routes
router.use("/shifts", shiftRoutes);

// Transaction routes
router.use("/transactions", transactionRoutes);

export default router;