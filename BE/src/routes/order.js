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
  getPriceRefundByDay,
  getPriceCancelByDay,
  getPriceRefundByWeek,
  getPriceCancelByWeek,
  getPriceRefundByMonth,
  getPriceCancelByMonth,
  getPriceRefundByYear,
  getPriceCancelByYear,
  getPriceRefundByCustomDay,
  getPriceCancelByCustomDay,
  getTotalOrdersByDate,

} from "../controller/order.js";
import { checkAuth } from "../middleware/checkAuth.js";
const orderRouter = Router();

orderRouter.post("/add-order", checkAuth, createOrder);
orderRouter.post("/", getAllOrders);
orderRouter.get("/", getTotalOrdersByDate);
// orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);
orderRouter.get("/:id", detailOrder);
orderRouter.post("/update-status", updateOrderStatus);
orderRouter.get("/total-price/day", getTotalPriceByDay);
orderRouter.get("/price-refund/day", getPriceRefundByDay);
orderRouter.get("/price-cancel/day", getPriceCancelByDay);
orderRouter.get("/total-price/week", getTotalPriceByWeek);
orderRouter.get("/price-refund/week", getPriceRefundByWeek);
orderRouter.get("/price-cancel/week", getPriceCancelByWeek);
orderRouter.get("/total-price/month", getTotalPriceByMonth);
orderRouter.get("/price-refund/month", getPriceRefundByMonth);
orderRouter.get("/price-cancel/month", getPriceCancelByMonth);
orderRouter.get("/total-price/year", getTotalPriceByYear);
orderRouter.get("/price-refund/year", getPriceRefundByYear);
orderRouter.get("/price-cancel/year", getPriceCancelByYear);
orderRouter.get("/total-price/custom-day", getTotalPriceByCustomDay);
orderRouter.get("/price-refund/custom-day", getPriceRefundByCustomDay);
orderRouter.get("/price-cancel/custom-day", getPriceCancelByCustomDay);

export default orderRouter;