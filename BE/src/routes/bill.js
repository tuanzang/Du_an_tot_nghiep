import { Router } from "express";
import { detailBill, getAllBill, updateStatusBill } from "../controller/bill";

const billRouter = Router();

billRouter.post("/", getAllBill);
billRouter.get("/:id", detailBill);
billRouter.post("/update-status", updateStatusBill);

export default billRouter;
