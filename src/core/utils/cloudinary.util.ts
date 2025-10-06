import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

// dari project lama

// === CONFIG ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === UPLOAD ===
export const cloudinaryUpload = (
  file: Express.Multer.File,
  publicId?: string,    // Optional standardized name
  folder?: string    // Optional folder name 
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder, // Cloudinary will auto-create folder
        resource_type: "image", // optional: force image type
        overwrite: true, // overwrite if same public_id exists
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

/**
 * Extract Cloudinary public_id dari URL (robust, termasuk folder).
 * Mendukung folder + versi Cloudinary di URL:
 * https://res.cloudinary.com/<cloud>/image/upload/v123/folder/sub/abc123.jpg
 * -> "folder/sub/abc123"
 */

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

    const publicId = [...folders, filenameNoExt].join("/");
    if (!publicId) throw new Error("Empty public_id");
    return publicId;
  } catch {
    // fallback jika URL tidak standar
    const parts = url.split("/");
    const filename = parts[parts.length - 1]?.split(".")[0] ?? "";
    return filename;
  }
};

// === DELETE ===

// Delete image from cloudinary using the public ID extracted from the URL
export const cloudinaryRemove = async (secureUrl: string) => {
  const publicId = extractPublicIdFromUrl(secureUrl);
  return await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

// Remove image by public_id directly
export const cloudinaryRemoveByPublicId = async (publicId: string) => {
  if (!publicId) throw new Error("publicId is required");
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};
