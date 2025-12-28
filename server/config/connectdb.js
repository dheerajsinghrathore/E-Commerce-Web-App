import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB. Please check if your IP is whitelisted in MongoDB Atlas.");
    console.error("Current Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
