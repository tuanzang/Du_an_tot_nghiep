import { Router } from "express";
import authRouter from "./authRouter.js";
import productRouter from "./products.js";
import categoryRouter from "./category.js";
import userRouter from "./users.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/users", userRouter);

export default router;
