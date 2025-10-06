import multer from "multer";

// dari project lama

// MIME type yang diperbolehkan
const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

// Helper untuk membuat konfigurasi multer dengan memory storage
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

// Rules uploader khusus untuk kebutuhan Cashier App
export const uploaderRules = {
  // Hanya untuk upload 1 foto profil (Admin atau Cashier)
  profileImage: memoryUploader({
    allowedTypes: allowedImageTypes,
    maxSizeMB: 2, // kecil karena cuma foto profil
  }),

  // Untuk upload beberapa gambar produk
  productImages: memoryUploader({
    allowedTypes: allowedImageTypes,
    maxSizeMB: 10, // lebih besar karena bisa banyak
  }),
};
