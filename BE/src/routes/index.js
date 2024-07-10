import { Router } from "express";
import authRouter from "./authRouter.js";
import productRouter from "./products.js";
import categoryRouter from "./category.js";
import userRouter from "./users.js";
import cartRouter from "./carts.js";
import orderRouter from "./order.js";
import commentRouter from "./comment.js";
import historyBillRouter from "./historyBill.js";
import transBillRouter from "./transaction.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/comments", commentRouter);
router.use("/users", userRouter);
router.use("/carts", cartRouter);
router.use("/orders", orderRouter);
router.use("/history-bill", historyBillRouter);
router.use("/trans", transBillRouter);

export default router;
