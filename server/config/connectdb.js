import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error(
    "MONGO_URI is not defined in environment variables, Please set it up in .env file"
  );
}
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.error("Please check your internet connection and MongoDB URI");
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
