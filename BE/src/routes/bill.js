import { Router } from "express";
import {
  decreaseProductSize,
  detailBill,
  getAllBill,
  getAllBillByIdUser,
  increaseProductSize,
  updateStatusBill,
} from "../controller/bill";

const billRouter = Router();

billRouter.post("/", getAllBill);
billRouter.post("/byUserId", getAllBillByIdUser);
billRouter.get("/:id", detailBill);
billRouter.post("/update-status", updateStatusBill);
billRouter.post("/decrease-product-size", decreaseProductSize);
billRouter.post("/increase-product-size", increaseProductSize);

export default billRouter;
