"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = require("./config/helmet");
const cors_1 = require("./config/cors");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./core/middlewares/error.middleware");
/* Server Setup */
const app = (0, express_1.default)();
// Middleware
app.use(helmet_1.helmetConfig);
app.use(cors_1.corsConfig);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api", routes_1.default);
// Health Check
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});
// Not Found (route tidak ada)
app.use(error_middleware_1.notFoundHandler);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
