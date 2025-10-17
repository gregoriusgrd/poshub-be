"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.signJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const env_1 = require("../../config/env");
(0, dotenv_1.config)();
const JWT_SECRET = env_1.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d"; // 1 day
// Buat JWT token baru
const signJwtToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.signJwtToken = signJwtToken;
// Verifikasi dan decode JWT token
const verifyJwtToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyJwtToken = verifyJwtToken;
