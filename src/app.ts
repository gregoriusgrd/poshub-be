import express from 'express';
import cookieParser from 'cookie-parser';
import { helmetConfig } from './config/helmet';
import { corsConfig } from './config/cors';
import router from './routes';

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

export default app;