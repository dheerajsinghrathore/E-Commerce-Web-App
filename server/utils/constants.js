/**
 * Application constants
 * Centralized configuration values
 */

// Cookie options
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
};

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 60 * 60 * 1000, // 1 hour
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// OTP expiration time (1 hour)
export const OTP_EXPIRATION_TIME = 60 * 60 * 1000;

// Token expiration times
export const ACCESS_TOKEN_EXPIRATION = "1h";
export const REFRESH_TOKEN_EXPIRATION = "30d";

// Password salt rounds
export const BCRYPT_SALT_ROUNDS = 10;

export default {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  OTP_EXPIRATION_TIME,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  BCRYPT_SALT_ROUNDS,
};

