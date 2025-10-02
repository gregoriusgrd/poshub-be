import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// custom format log
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
})

export const logger = winston.createLogger({
    level: "info", // level log
    format: combine(
        colorize(),     // warna di console
        timestamp(),    // tambah timestamp
        logFormat
    ),
    transports: [
        new winston.transports.Console(), // Log to console
    ]
})

// cara pakai:
// logger.info("Server started");
// logger.error("Database connection failed");