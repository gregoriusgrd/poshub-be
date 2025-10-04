import { Router } from "express";
import authRoutes from "../domains/auth/routes/auth.route";

const router = Router();

// Example route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" })
})

router.use("/auth", authRoutes);

export default router;