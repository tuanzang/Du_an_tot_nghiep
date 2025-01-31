import { Router } from "express";
import {
  createTransBill,
  findAndUpdateTransBill,
  getTransBillByIdBill,
} from "../controller/transaction.js";

const transBillRouter = Router();

transBillRouter.post("/", getTransBillByIdBill);
transBillRouter.post("/add", createTransBill);
transBillRouter.post("/update", findAndUpdateTransBill);

export default transBillRouter;
