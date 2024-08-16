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
  getTotalOrdersByDate,
  getTotalShippingCostByDay,
  getTotalShippingCostByWeek,
  getTotalShippingCostByMonth,
  getTotalShippingCostByYear,
  getTotalShippingCostByCustomDay,

} from "../controller/order.js";
import { checkAuth } from "../middleware/checkAuth.js";
const orderRouter = Router();


orderRouter.post("/add-order", checkAuth, createOrder);
orderRouter.post("/", getAllOrders);
orderRouter.get("/", getAllOrders);
orderRouter.get("/", getTotalOrdersByDate);
// orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);
orderRouter.get("/:id", detailOrder);
orderRouter.post("/update-status", updateOrderStatus);
orderRouter.get("/total-price/day", getTotalPriceByDay);
orderRouter.get("/price-shipping/day", getTotalShippingCostByDay)
orderRouter.get("/total-price/week", getTotalPriceByWeek);
orderRouter.get("/price-shipping/week", getTotalShippingCostByWeek);
orderRouter.get("/total-price/month", getTotalPriceByMonth);
orderRouter.get("/price-shipping/month", getTotalShippingCostByMonth)
orderRouter.get("/total-price/year", getTotalPriceByYear);
orderRouter.get("/price-shipping/year", getTotalShippingCostByYear)
orderRouter.get("/total-price/custom-day", getTotalPriceByCustomDay);
orderRouter.get("/price-shipping/custom-day", getTotalShippingCostByCustomDay)

export default orderRouter;