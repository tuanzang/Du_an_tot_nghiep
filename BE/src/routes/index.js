import { Router } from "express";
import authRouter from "./authRouter.js";
import productRouter from "./products.js";
import categoryRouter from "./category.js";
import cartRouter from "./carts.js";
import orderRouter from "./order.js";
import sizeRouter from "./size.js";
import commentRouter from "./comment.js";
import historyBillRouter from "./historyBill.js";
import transBillRouter from "./transaction.js";
import topOrderRouter from "./topOrder.js";
import stockOrderRouter from "./stockProduct.js";
import billRouter from "./bill.js";
import userRouter from "./users.js";
import DiscountCode from "./DiscountCode.js";
import optionRouter from "./option.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/comments", commentRouter);
router.use("/users", userRouter);
router.use("/carts", cartRouter);
router.use("/orders", orderRouter);
router.use("/sizes", sizeRouter);
router.use("/bills", billRouter);
router.use("/history-bill", historyBillRouter);
router.use("/trans", transBillRouter);
router.use("/topOrder", topOrderRouter);
router.use("/stockOrder", stockOrderRouter);
router.use("/discountCode",DiscountCode);
router.use("/options",optionRouter)
export default router;
