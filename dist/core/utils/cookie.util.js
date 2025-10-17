"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = setAuthCookie;
exports.clearAuthCookie = clearAuthCookie;
const isProd = process.env.NODE_ENV === "production";
// Set cookie untuk auth token
function setAuthCookie(res, token) {
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax", // prod: beda domain → "none"
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
}
// Hapus cookie auth token
function clearAuthCookie(res) {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });
}
