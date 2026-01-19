import {Router} from "express";
import auth from "../middleware/auth.js";
import { createProductController, getProductsController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create", auth, createProductController);
productRouter.get("/get-products", auth, getProductsController);
export default productRouter;