import { Router } from "express";
import { createProduct, deleteProduct, getAllProduct, getDetailProduct, updateProduct } from "../controller/products";

const productRouter = Router();

productRouter.get('/', getAllProduct) 
productRouter.get('/:id', getDetailProduct)
productRouter.post("/add", createProduct)
productRouter.put('/:id', updateProduct)
productRouter.get('/:id', deleteProduct)


export default productRouter