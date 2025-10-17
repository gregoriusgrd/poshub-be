"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploaderRules = void 0;
const multer_1 = __importDefault(require("multer"));
// MIME type yang diperbolehkan
const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
// Helper untuk konfigurasi multer dengan memory storage
const memoryUploader = (options) => {
    return (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(),
        limits: {
            fileSize: options.maxSizeMB * 1024 * 1024, // konversi MB → bytes
        },
        fileFilter: (_req, file, cb) => {
            if (options.allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error("❌ Invalid file type. Only image files are allowed."));
            }
        },
    });
};
// Rules uploader khusus Cashier App
exports.uploaderRules = {
    // Upload 1 foto profil (Admin atau Cashier)
    profileImage: memoryUploader({
        allowedTypes: allowedImageTypes,
        maxSizeMB: 1, // 1 MB cukup untuk foto profil
    }),
    // Upload 1 gambar produk
    productImage: memoryUploader({
        allowedTypes: allowedImageTypes,
        maxSizeMB: 1, // 1 MB juga cukup untuk produk
    }),
};
