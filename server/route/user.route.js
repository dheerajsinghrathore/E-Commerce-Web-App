import { Router } from "express";
import {
  registerUser,
  loginController,
  verifyEmailController,
  logoutController,
  uploadCloudinaryImageController,
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

export default router;
