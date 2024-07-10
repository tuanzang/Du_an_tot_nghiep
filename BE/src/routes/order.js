import { Router } from "express";
import {
  createOrder,
<<<<<<< HEAD
  deleteOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
=======
  detailOrder,
  getAllOrders,
  updateOrderStatus,
>>>>>>> 4a750a9f47f8095b0286710a0234a58ecb7a0e94
} from "../controller/order.js";
import { checkAuth } from "../middleware/checkAuth.js";

const orderRouter = Router();

orderRouter.post("/add-order", checkAuth, createOrder);
orderRouter.get("/", getAllOrders);
<<<<<<< HEAD
orderRouter.get("/:id", getMyOrders);
orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);
=======
orderRouter.get("/:id", detailOrder);
orderRouter.post("/update-status", updateOrderStatus);
>>>>>>> 4a750a9f47f8095b0286710a0234a58ecb7a0e94

export default orderRouter;
