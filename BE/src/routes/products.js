import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
  searchProducts,
  updateProduct,
  filterProductsByPrice,
  createProductSizes,
  getProductSizesByProductId,
  updateProductSizes,
  filterProductByCategory,
} from "../controller/products.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.get("/search", searchProducts);
productRouter.get("/:id", getDetailProduct);
productRouter.post("/add", createProduct);
productRouter.post("/add/size", createProductSizes);
productRouter.get("/productSize/:idProduct", getProductSizesByProductId);
productRouter.put("/:id", updateProduct);
productRouter.put("/productSize/:id", updateProductSizes);
productRouter.delete("/:id", deleteProduct);
productRouter.get('/filter/price', filterProductsByPrice);
productRouter.get('/filter/category/:categoryId', filterProductByCategory);

export default productRouter;
