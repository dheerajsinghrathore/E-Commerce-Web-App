import { Router } from "express";
import uploadImageController from "../controllers/uploadImage.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post(
  "/upload-image",
  auth,
  upload.single("image"),
  uploadImageController
);

export default router;
