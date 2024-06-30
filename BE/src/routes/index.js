import { Router } from "express";
import authRouter from "./authRouter";
import productRouter from "./products";
import categoryRouter from "./category";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);

export default router;
