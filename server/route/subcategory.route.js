import { Router } from "express";
import {
  createSubCategoryController,
  getSubCategoriesByCategoryIdController,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategory.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

// Create a new subcategory
router.post("/create", auth, createSubCategoryController);

// Get all subcategories
router.get("/get", auth, getSubCategories);

// Get subcategories by category ID
router.get(
  "/category/:categoryId",
  auth,
  getSubCategoriesByCategoryIdController,
);
router.put(
  "/update/:id",
  auth,
  updateSubCategory,
);

router.delete(
  "/delete/:id",
  auth,
  deleteSubCategory,
);

export default router;
