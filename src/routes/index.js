import { Router } from "express";
import authRouter from "./authRouter";
import productRouter from "./products";

const router = Router()

router.use('/auth', authRouter)
router.use("/products", productRouter)

export default router