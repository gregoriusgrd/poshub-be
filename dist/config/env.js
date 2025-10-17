"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is missing in .env file");
}
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("❌ Cloudinary configuration is missing in .env file");
}
exports.env = {
    PORT: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "4000",
    NODE_ENV: (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : "development",
    FRONTEND_URL: (_c = process.env.FRONTEND_URL) !== null && _c !== void 0 ? _c : "http://localhost:3000",
    JWT_SECRET: process.env.JWT_SECRET,
    // CLOUDINARY
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
