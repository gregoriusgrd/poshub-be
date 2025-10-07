import { Router } from "express";
import authRoutes from "../domains/auth/routes/auth.route";
import cashierRoutes from "../domains/cashier/routes/cashier.route";
import productRoutes from "../domains/product/routes/product.route";
import categoryRoutes from "../domains/category/routes/category.route";

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

export default router;