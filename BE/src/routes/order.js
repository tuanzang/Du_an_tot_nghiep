import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
} from "../controller/order.js";
import { checkAuth } from "../middleware/checkAuth.js";

const orderRouter = Router();

orderRouter.post("/add-order", checkAuth, createOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/:id", getMyOrders);
orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
