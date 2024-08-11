import { Router } from "express";
import {
  createSize,
  updateSize,
  findSizeById,
  getAllSize,
  getPageSize,
} from "../controller/size";

const sizeRouter = Router();
sizeRouter.get("/", getAllSize);
sizeRouter.post("/page", getPageSize);
sizeRouter.post("/add", createSize);
sizeRouter.put("/update", updateSize);
sizeRouter.get("/findOne", findSizeById);

export default sizeRouter;
