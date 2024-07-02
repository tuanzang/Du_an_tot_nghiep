import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
  updateProduct,
} from "../controller/products.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.get("/:id", getDetailProduct);
productRouter.post("/add", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
