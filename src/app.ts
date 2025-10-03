import express from 'express';
import cookieParser from 'cookie-parser';
import { helmetConfig } from './config/helmet';
import { corsConfig } from './config/cors';
import router from './routes';
import { errorHandler, notFoundHandler } from './core/middlewares/error.middleware';

/* Server Setup */

const app = express();

// Middleware
app.use(helmetConfig);
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", router);

// Health Check
app.get("/", (req, res) => {
    res.send("Server is running 🚀")
})

// Not Found (route tidak ada)
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;