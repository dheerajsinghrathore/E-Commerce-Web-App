import { Router } from "express";
import {
  registerUser,
  loginController,
  verifyEmailController,
  logoutController,
  uploadCloudinaryImageController,
  updateUserProfileController,
  forgotPasswordController,
  verifyForgotPasswordOtpController,
  resetPasswordController,
  refreshTokenController,
  loginUserDetailsController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.get("/logout", auth, logoutController);
router.put(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  uploadCloudinaryImageController
);

router.put("/update-user", auth, updateUserProfileController);
router.post("/forgot-password", forgotPasswordController);
router.put("/forgot-password", forgotPasswordController); // Support both POST and PUT
router.put("/verify-otp", verifyForgotPasswordOtpController); // Support OTP verification
router.put("/reset-password", resetPasswordController); // Support both POST and PUT
router.post("/refresh-token", refreshTokenController); // Token refresh route
router.get("/user-details", auth, loginUserDetailsController);

export default router;
