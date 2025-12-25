import UserModel from "../models/user.model.js";
import verifyEmailTemplate from "../utils/verify_email_template.js";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadCloudinaryImage from "../utils/uploadCloudinaryImage.js";

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
