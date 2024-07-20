import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  // getMyOrders,
  // updateOrder,
  detailOrder,
  updateOrderStatus,
  getTotalPriceByDay,
  getTotalPriceByWeek,
  getTotalPriceByMonth,
  getTotalPriceByYear,
  getTotalPriceByCustomDay,

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
orderRouter.get("/total-price/day", getTotalPriceByDay);
orderRouter.get("/total-price/week", getTotalPriceByWeek);
orderRouter.get("/total-price/month", getTotalPriceByMonth);
orderRouter.get("/total-price/year", getTotalPriceByYear);
orderRouter.get("/total-price/custom-day", getTotalPriceByCustomDay);




export default orderRouter;
