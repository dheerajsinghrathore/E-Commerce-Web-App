/**
 * Standardized API response helper functions
 * Provides consistent response format across all endpoints
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Response message
 * @param {*} data - Response data (optional)
 */
export const sendSuccess = (res, statusCode = 200, message, data = null) => {
  const response = {
    message,
    error: false,
    success: true,
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} message - Error message
 */
export const sendError = (res, statusCode = 400, message) => {
  return res.status(statusCode).json({
    message,
    error: true,
    success: false,
  });
};

/**
 * Send server error response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 */
export const sendServerError = (res, error) => {
  console.error("Server error:", error);
  return res.status(500).json({
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error. Please try again later." 
      : error.message,
    error: true,
    success: false,
  });
};

export default { sendSuccess, sendError, sendServerError };

