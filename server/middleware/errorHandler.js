/**
 * Global error handler middleware
 * Handles all unhandled errors and provides consistent error responses
 */

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors).map((e) => e.message).join(", "),
      error: true,
      success: false,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      message: `${field} already exists.`,
      error: true,
      success: false,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token.",
      error: true,
      success: false,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token has expired.",
      error: true,
      success: false,
    });
  }

  // Default error response
  return res.status(err.statusCode || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error. Please try again later."
      : err.message,
    error: true,
    success: false,
  });
};

export default errorHandler;

