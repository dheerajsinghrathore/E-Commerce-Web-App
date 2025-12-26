import UserModel from "../models/user.model.js";
import verifyEmailTemplate from "../utils/verify_email_template.js";
import forgotPasswordTemplate from "../utils/forgot_password_template.js";
import validatePassword from "../utils/validatePassword.js";
import validateEmail from "../utils/validateEmail.js";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadCloudinaryImage from "../utils/uploadCloudinaryImage.js";
import generateOTP from "../utils/generateOTP.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
        error: true,
        success: false,
      });
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        message: emailValidation.message,
        error: true,
        success: false,
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: passwordValidation.message,
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists.",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Send verification email
    try {
      await sendEmail(
        name,
        email,
        "Verify your email address",
        verifyEmailTemplate({
          name,
          verifyToken: newUser._id.toString(),
        })
      );
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Log detailed error for debugging
      if (
        emailError.message?.includes("validation_error") ||
        emailError.message?.includes("testing emails")
      ) {
        console.error("⚠️  Resend Domain Verification Required!");
        console.error(
          "   To send emails to all recipients, verify a domain at: https://resend.com/domains"
        );
        console.error(
          "   For testing, you can only send to: dheerajrathore707@gmail.com"
        );
      }
      // User is created, but email failed - still return success but log the error
      // You might want to handle this differently based on your requirements
    }

    return res.json({
      message: "User registered successfully. Please verify your email.",
      error: false,
      success: true,
      data: newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { verifyToken } = req.body;
    const user = await UserModel.findOne({ _id: verifyToken });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token.",
        error: true,
        success: false,
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Email is already verified.",
        error: false,
        success: true,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: verifyToken },
      { verify_email: true }
    );

    return res.json({
      message: "Email verified successfully.",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password.",
        error: true,
        success: false,
      });
    }

    if (!user.verify_email) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      message: "Login successful.",
      error: false,
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

export async function logoutController(req, res) {
  try {
    // Clear refresh token from database if user ID is available
    if (req.user && req.user.id) {
      await UserModel.findByIdAndUpdate(
        req.user.id,
        { refresh_token: "" },
        { new: true }
      );
    }

    // Clear cookies with the same options used when setting them
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.json({
      message: "Logout successful.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

//Upload Cloudinary Image Function to upload image to cloudinary and save url to user model
export async function uploadCloudinaryImageController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded.",
        error: true,
        success: false,
      });
    }

    const uploadResult = await uploadCloudinaryImage(req.file);

    // Auth middleware sets req.user with decoded token containing id
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User authentication required.",
        error: true,
        success: false,
      });
    }

    const userId = req.user.id;

    // Use secure_url if available, otherwise fall back to url
    const imageUrl = uploadResult.secure_url || uploadResult.url;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Image uploaded successfully.",
      error: false,
      success: true,
      data: {
        _id: updatedUser._id,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

//Update User Profile Controller
export async function updateUserProfileController(req, res) {
  try {
    // Auth middleware sets req.user with decoded token containing id,
    // Added validation - check that req.user and req.user.id exist before proceeding
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User authentication required.",
        error: true,
        success: false,
      });
    }

    const userId = req.user.id; //accessing the user ID from the auth middleware

    // Define allowed fields that can be updated
    const allowedFields = ["name", "email", "mobile", "password"];

    // Check if any fields other than allowed fields are present
    const requestFields = Object.keys(req.body);
    const invalidFields = requestFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `The following field(s) cannot be updated: ${invalidFields.join(
          ", "
        )}. Only name, email, mobile, and password can be updated.`,
        error: true,
        success: false,
      });
    }

    const { name, email, mobile, password } = req.body;

    // Email validation
    if (email !== undefined && email !== "") {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({
          message: emailValidation.message,
          error: true,
          success: false,
        });
      }

      // Check if email is already in use by another user
      const existingUser = await UserModel.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered to another user.",
          error: true,
          success: false,
        });
      }
    }

    // Mobile number validation (10 digits, can start with + for international)
    if (mobile !== undefined && mobile !== "") {
      // Allow formats: 10 digits, or international format starting with +
      // Examples: 1234567890, +911234567890, +1-234-567-8900
      const mobileRegex =
        /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
      const digitsOnly = mobile.replace(/[^0-9]/g, "");

      // Check if it's a valid format and has at least 10 digits
      if (
        !mobileRegex.test(mobile) ||
        digitsOnly.length < 10 ||
        digitsOnly.length > 15
      ) {
        return res.status(400).json({
          message: "Please provide a valid mobile number (10-15 digits).",
          error: true,
          success: false,
        });
      }
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (email !== undefined) updatedData.email = email;
    if (mobile !== undefined) updatedData.mobile = mobile;

    if (password) {
      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          message: passwordValidation.message,
          error: true,
          success: false,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "User profile updated successfully.",
      error: false,
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

//Forgot password controller.
//Not Login
export async function forgotPasswordController(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is required.",
        error: true,
        success: false,
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
        error: true,
        success: false,
      });
    }

    // Email validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        message: emailValidation.message,
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist.",
        error: true,
        success: false,
      });
    }

    // Generate OTP and send email
    const otp = generateOTP();
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // OTP valid for 1 hour

    // Update user with OTP and expiry
    user.forgot_password_otp = otp;
    user.forgot_password_expiry = expirationTime;
    await user.save();

    // Send email with OTP
    try {
      await sendEmail(
        user.name,
        user.email,
        "Password Reset OTP",
        forgotPasswordTemplate(user.name, otp)
      );
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Clear OTP if email fails
      user.forgot_password_otp = "";
      user.forgot_password_expiry = null;
      await user.save();

      return res.status(500).json({
        message: "Failed to send email. Please try again later.",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "OTP sent to your email address.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

//Verify Forgot Password OTP controller.
export async function verifyForgotPasswordOtpController(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is required.",
        error: true,
        success: false,
      });
    }

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist.",
        error: true,
        success: false,
      });
    }

    // Check if OTP matches and is not expired
    if (user.forgot_password_otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
        error: true,
        success: false,
      });
    }

    const now = new Date();
    if (user.forgot_password_expiry < now) {
      return res.status(400).json({
        message: "OTP has expired.",
        error: true,
        success: false,
      });
    }

    // Clear OTP and expiry
    user.forgot_password_otp = "";
    user.forgot_password_expiry = null;
    await user.save();

    return res.json({
      message: "OTP verified successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

//Reset password controller.
export async function resetPasswordController(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is required.",
        error: true,
        success: false,
      });
    }

    const { email, newPassword, confPassword } = req.body;

    // Required fields check (reject empty strings as well)
    if (
      !email ||
      !newPassword ||
      !confPassword ||
      newPassword.trim() === "" ||
      confPassword.trim() === ""
    ) {
      return res.status(400).json({
        message: "Email, new password, and confirm password are required.",
        error: true,
        success: false,
      });
    }

    // Confirm password must match
    if (newPassword !== confPassword) {
      return res.status(400).json({
        message: "New password and confirm password must match.",
        error: true,
        success: false,
      });
    }

    // Email validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        message: emailValidation.message,
        error: true,
        success: false,
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: passwordValidation.message,
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist.",
        error: true,
        success: false,
      });
    }

    // Verify that OTP was verified (OTP should be cleared after verification)
    if (user.forgot_password_otp) {
      return res.status(400).json({
        message: "Please verify OTP first before resetting password.",
        error: true,
        success: false,
      });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    // Clear any remaining OTP data
    user.forgot_password_otp = "";
    user.forgot_password_expiry = null;

    await user.save();

    return res.json({
      message: "Password reset successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}

// Refresh Token Controller
export async function refreshTokenController(req, res) {
  try {
    if (!process.env.SECRET_KEY_REFRESH_TOKEN) {
      return res.status(500).json({
        message: "Server configuration error. Please contact administrator.",
        error: true,
        success: false,
      });
    }

    const refreshToken =
      req.cookies.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found. Please log in again.",
        error: true,
        success: false,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Refresh token has expired. Please log in again.",
          error: true,
          success: false,
        });
      }
      return res.status(401).json({
        message: "Invalid refresh token.",
        error: true,
        success: false,
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid refresh token.",
        error: true,
        success: false,
      });
    }

    // Verify the refresh token matches what's stored in the database
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    if (user.refresh_token !== refreshToken) {
      return res.status(401).json({
        message: "Refresh token mismatch. Please log in again.",
        error: true,
        success: false,
      });
    }

    // Generate new access token with full user object
    const accessToken = await generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({
      message: "New access token generated successfully.",
      error: false,
      success: true,
      data: {
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(500)
      .json({ message: error.message, error: true, success: false });
  }
}
