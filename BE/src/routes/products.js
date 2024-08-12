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
  adminGetDetailProduct,
} from "../controller/products.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.post("/search", searchProducts);
productRouter.get("/:id", getDetailProduct);
productRouter.get("/:id/admin", adminGetDetailProduct);
productRouter.post("/add", createProduct);
productRouter.post("/:productId/add/size", createProductSizes);
productRouter.get("/productSize/:idProduct", getProductSizesByProductId);
productRouter.put("/:id", updateProduct);
productRouter.put("/productSize/:id", updateProductSizes);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/filter/price", filterProductsByPrice);
productRouter.get("/filter/category/:categoryId", filterProductByCategory);

export default productRouter;
