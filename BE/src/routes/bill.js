import { Router } from "express";
import {
  detailBill,
  getAllBill,
  getAllBillByIdUser,
  updateStatusBill,
} from "../controller/bill";

const billRouter = Router();

billRouter.post("/", getAllBill);
billRouter.post("/byUserId", getAllBillByIdUser);
billRouter.get("/:id", detailBill);
billRouter.post("/update-status", updateStatusBill);

export default billRouter;
