import { Router } from "express";
import {
  createSize,
  updateSize,
  deleteSize,
  findSizeById,
  getAllSize,
} from "../controller/size";

const sizeRouter = Router();
sizeRouter.post("/", getAllSize);
sizeRouter.post("/add", createSize);
sizeRouter.post("/update", updateSize);
sizeRouter.post("/delete", deleteSize);
sizeRouter.post("/findOne", findSizeById);

export default sizeRouter;
