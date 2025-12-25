import multer from "multer";

// Use memory storage for Cloudinary uploads (files will be stored in memory as buffer)
const memoryStorage = multer.memoryStorage();

// Use disk storage if you need to save files locally
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Default export uses memory storage for Cloudinary
const upload = multer({ storage: memoryStorage });

export default upload;