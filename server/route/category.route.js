import { Router } from "express";
import { CreateCategoryController, getCategories, updateCategoryController, deleteCategoryController } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

// Route to create a new category
router.post("/add-category", auth, CreateCategoryController);
router.get("/get-category", getCategories);
router.put("/update-category", auth, updateCategoryController);
router.delete("/delete-category", auth, deleteCategoryController);
export default router;