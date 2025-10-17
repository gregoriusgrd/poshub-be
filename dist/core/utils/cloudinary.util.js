"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryRemove = exports.cloudinaryUpload = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier = __importStar(require("streamifier"));
// === CONFIG ===
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// === UPLOAD SINGLE IMAGE ===
const cloudinaryUpload = (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};
exports.cloudinaryUpload = cloudinaryUpload;
// === EXTRACT PUBLIC ID ===
const extractPublicIdFromUrl = (url) => {
    var _a, _b, _c;
    try {
        const u = new URL(url);
        const parts = u.pathname.split("/").filter(Boolean);
        const uploadIdx = parts.findIndex((p) => p === "upload");
        if (uploadIdx === -1)
            throw new Error("No /upload/ segment");
        const afterUpload = parts.slice(uploadIdx + 1);
        const hasVersion = ((_a = afterUpload[0]) === null || _a === void 0 ? void 0 : _a.startsWith("v")) && /^\d+$/.test(afterUpload[0].slice(1));
        const startIdx = uploadIdx + 1 + (hasVersion ? 1 : 0);
        const last = parts[parts.length - 1];
        const filenameNoExt = last.replace(/\.[^/.]+$/, "");
        const folders = parts.slice(startIdx, parts.length - 1);
        return [...folders, filenameNoExt].join("/");
    }
    catch (_d) {
        const parts = url.split("/");
        return (_c = (_b = parts[parts.length - 1]) === null || _b === void 0 ? void 0 : _b.split(".")[0]) !== null && _c !== void 0 ? _c : "";
    }
};
// === DELETE SINGLE IMAGE ===
const cloudinaryRemove = (secureUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const publicId = extractPublicIdFromUrl(secureUrl);
    return cloudinary_1.v2.uploader.destroy(publicId, { resource_type: "image" });
});
exports.cloudinaryRemove = cloudinaryRemove;
