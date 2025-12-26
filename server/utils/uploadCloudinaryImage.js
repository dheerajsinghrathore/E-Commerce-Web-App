import { v2 as cloudinary } from "cloudinary";

// Lazy initialization to ensure dotenv.config() has run
let isConfigured = false;

const configureCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env file"
    );
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    isConfigured = true;
  }
};

const uploadCloudinaryImage = async (file) => {
  configureCloudinary(); // Ensure Cloudinary is configured before use

  if (!file) {
    throw new Error("No file provided");
  }

  // Handle file buffer from multer memory storage
  if (!file.buffer) {
    throw new Error("File buffer is missing. Make sure multer is configured with memoryStorage.");
  }

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: "ecommerce-webapp" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(file.buffer);
  });
  
  return uploadImage;
};

export default uploadCloudinaryImage;
