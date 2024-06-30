import { Router } from "express";
import productRouter from "./products";
import categoryRouter from "./category";
import sizeRouter from "./size";

const router = Router()

router.use("/products", productRouter)
router.use("/categories", categoryRouter)
router.use("/size", sizeRouter)

export default router