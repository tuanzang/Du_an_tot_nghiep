import { Router } from "express";
import {
  createOrder,
  detailOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controller/order.js";
import { checkAuth } from "../middleware/checkAuth.js";

const orderRouter = Router();

orderRouter.post("/add-order", checkAuth, createOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/:id", detailOrder);
orderRouter.post("/update-status", updateOrderStatus);

export default orderRouter;
