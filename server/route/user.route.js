import { Router } from "express";
import {
  registerUser,
  loginController,
  verifyEmailController,
  logoutController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.get("/logout", auth, logoutController);

export default router;
