import { Router } from "express";
import authRoutes from "../domains/auth/routes/auth.route";
import cashierRoutes from "../domains/cashier/routes/cashier.route";

const router = Router();

// Example route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" })
})

// Auth routes
router.use("/auth", authRoutes);

// Cashier routes
router.use("/cashiers", cashierRoutes);

export default router;