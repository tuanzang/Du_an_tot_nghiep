import { Router } from "express";
import authRouter from "./authRouter.js";
import productRouter from "./products.js";
import categoryRouter from "./category.js";
import userRouter from "./users.js";
import cartRouter from "./carts.js";
import orderRouter from "./order.js";
<<<<<<< HEAD
import sizeRouter from "./size";
=======
import commentRouter from "./comment.js";
import historyBillRouter from "./historyBill.js";
import transBillRouter from "./transaction.js";
>>>>>>> 4a750a9f47f8095b0286710a0234a58ecb7a0e94

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/comments", commentRouter);
router.use("/users", userRouter);
router.use("/carts", cartRouter);
router.use("/orders", orderRouter);
<<<<<<< HEAD
router.use("/sizes", sizeRouter)
=======
router.use("/history-bill", historyBillRouter);
router.use("/trans", transBillRouter);
>>>>>>> 4a750a9f47f8095b0286710a0234a58ecb7a0e94

export default router;
