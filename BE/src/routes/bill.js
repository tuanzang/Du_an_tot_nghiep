import { Router } from "express";
import {
  decreaseProductSizeAndOption,
  detailBill,
  getAllBill,
  getAllBillByIdUser,
  increaseProductSizeAndOption,
  updateStatusBill,
} from "../controller/bill";

const billRouter = Router();

billRouter.post("/", getAllBill);
billRouter.post("/byUserId", getAllBillByIdUser);
billRouter.get("/:id", detailBill);
billRouter.post("/update-status", updateStatusBill);
billRouter.post("/decrease-data", decreaseProductSizeAndOption);
billRouter.post("/increase-data", increaseProductSizeAndOption);

export default billRouter;
