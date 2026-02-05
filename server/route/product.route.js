import { Router } from "express";
import auth from "../middleware/auth.js";
import { createProductController, getProductsByCategory, getProductsController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create", auth, createProductController);
productRouter.get("/get-products", auth, getProductsController);
productRouter.post("/get-products-by-category", auth, getProductsByCategory);
export default productRouter;