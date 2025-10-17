"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize } = winston_1.default.format;
// custom format log
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
exports.logger = winston_1.default.createLogger({
    level: "info", // level log
    format: combine(colorize(), // warna di console
    timestamp(), // tambah timestamp
    logFormat),
    transports: [
        new winston_1.default.transports.Console(), // Log to console
    ]
});
// cara pakai:
// logger.info("Server started");
// logger.error("Database connection failed");
