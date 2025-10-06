import multer from "multer";
import path from "path";

// Simpan file sementara di memory agar langsung diupload ke Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maks 2MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    if (!allowed.includes(ext)) {
      return cb(new Error("Format file tidak didukung"));
    }
    cb(null, true);
  },
});
