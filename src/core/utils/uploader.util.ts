import multer from "multer";

// MIME type yang diperbolehkan
const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

// Helper untuk konfigurasi multer dengan memory storage
const memoryUploader = (options: { allowedTypes: string[]; maxSizeMB: number }) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: options.maxSizeMB * 1024 * 1024, // konversi MB → bytes
    },
    fileFilter: (_req, file, cb) => {
      if (options.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("❌ Invalid file type. Only image files are allowed."));
      }
    },
  });
};

// Rules uploader khusus Cashier App
export const uploaderRules = {
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
