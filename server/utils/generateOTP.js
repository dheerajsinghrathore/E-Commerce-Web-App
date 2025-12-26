import jwt from "jsonwebtoken";

const OTP_LENGTH = 6;
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP from 100000 to 999999
};
export default generateOTP;
/**
 * Generates a JWT token containing the OTP and user identifier.
 *
 * @param {string} userId - The unique identifier for the user.
 * @param {string} otp - The one-time password to be included in the token.
 * @param {string} secretKey - The secret key used to sign the JWT.
 * @param {number} expiresIn - The expiration time for the token in seconds.
 * @returns {string} - The generated JWT token.
 */
export function generateOTPToken(userId, otp, secretKey, expiresIn = 300) {
  const payload = {
    userId,
    otp,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
}

/**
 * Verifies a JWT token and extracts the OTP and user identifier.
 *
 * @param {string} token - The JWT token to be verified.
 * @param {string} secretKey - The secret key used to verify the JWT.
 * @returns {Object} - An object containing the userId and otp if verification is successful.
 * @throws {Error} - Throws an error if the token is invalid or expired.
 */
export function verifyOTPToken(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return {
      userId: decoded.userId,
      otp: decoded.otp,
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
