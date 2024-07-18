import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  // getMyOrders,
  // updateOrder,
  detailOrder,
  updateOrderStatus,

} from "../controller/order.js";
import { checkAuth } from "../middleware/checkAuth.js";
const orderRouter = Router();

orderRouter.post("/add-order", checkAuth, createOrder);

orderRouter.post("/", getAllOrders);
orderRouter.get("/", getAllOrders);
// orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);
orderRouter.get("/:id", detailOrder);
orderRouter.post("/update-status", updateOrderStatus);


export default orderRouter;
