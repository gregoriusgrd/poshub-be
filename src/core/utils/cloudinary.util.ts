import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

// === CONFIG ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === UPLOAD SINGLE IMAGE ===
export const cloudinaryUpload = (
  file: Express.Multer.File,
  folder?: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// === EXTRACT PUBLIC ID ===
const extractPublicIdFromUrl = (url: string): string => {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);

    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) throw new Error("No /upload/ segment");

    const afterUpload = parts.slice(uploadIdx + 1);
    const hasVersion =
      afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].slice(1));
    const startIdx = uploadIdx + 1 + (hasVersion ? 1 : 0);

    const last = parts[parts.length - 1];
    const filenameNoExt = last.replace(/\.[^/.]+$/, "");
    const folders = parts.slice(startIdx, parts.length - 1);

    return [...folders, filenameNoExt].join("/");
  } catch {
    const parts = url.split("/");
    return parts[parts.length - 1]?.split(".")[0] ?? "";
  }
};

// === DELETE SINGLE IMAGE ===
export const cloudinaryRemove = async (secureUrl: string) => {
  const publicId = extractPublicIdFromUrl(secureUrl);
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};
