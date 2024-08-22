import { Router } from "express";
import {
  addCart,
  checkProductQuantity,
  getMyCarts,
  removeProduct,
  updateQuantity,
} from "../controller/cart.js";
import { checkAuth } from "../middleware/checkAuth.js";

const cartRouter = Router();

cartRouter.get("/", checkAuth, getMyCarts);
cartRouter.post("/", checkAuth, addCart);
cartRouter.put("/", checkAuth, updateQuantity);
cartRouter.delete("/", checkAuth, removeProduct);
cartRouter.post("/check-product-quantity", checkProductQuantity);

export default cartRouter;
