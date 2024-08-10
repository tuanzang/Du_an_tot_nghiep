import { Router } from "express";
import {
  createSize,
  updateSize,
  deleteSize,
  findSizeById,
  getAllSize,
} from "../controller/size";

const sizeRouter = Router();
sizeRouter.get("/", getAllSize);
sizeRouter.post("/add", createSize);
sizeRouter.put("/update", updateSize);
sizeRouter.delete("/delete", deleteSize);
sizeRouter.post("/findOne", findSizeById);

export default sizeRouter;
