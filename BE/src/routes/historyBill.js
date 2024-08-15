import { Router } from "express";
import {
  createHistoryBill,
  getHistoryBillByIdBill,
} from "../controller/historyBill.js";

const historyBillRouter = Router();

historyBillRouter.post("/", getHistoryBillByIdBill);
historyBillRouter.post("/add", createHistoryBill);

export default historyBillRouter;
