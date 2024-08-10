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

billRouter.get("/", getAllBill);
billRouter.post("/byUserId", getAllBillByIdUser);
billRouter.get("/:id", detailBill);
billRouter.put("/update-status", updateStatusBill);
billRouter.put("/decrease-data", decreaseProductSizeAndOption);
billRouter.put("/increase-data", increaseProductSizeAndOption);

export default billRouter;
