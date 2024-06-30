import { Router } from "express";
import { createSize, deleteSize, getAllSize } from "../controller/size";

const sizeRouter = Router();
sizeRouter.get('/', getAllSize) ;
sizeRouter.post("/add", createSize);
sizeRouter.delete('/:id', deleteSize);

export default sizeRouter