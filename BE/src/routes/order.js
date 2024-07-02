import { Router } from "express";
import { createOrder } from "../controller/order.js";
import { checkAuth } from "../middleware/checkAuth.js";

const orderRouter = Router();

orderRouter.post("/", checkAuth, createOrder);

export default orderRouter;
