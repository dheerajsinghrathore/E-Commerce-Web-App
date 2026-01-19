import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectdb.js";
import userRouter from "./route/user.route.js";
import errorHandler from "./middleware/errorHandler.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.route.js";
import subcategoryRouter from "./route/subcategory.route.js";
import productRouter from "./route/product.route.js";

dotenv.config();
const app = express();
const PORT = 8080 || process.env.PORT;

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONT_END_URL,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  }),
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subcategoryRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/product", productRouter);
// Global error handler (must be last middleware)
app.use(errorHandler);

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
