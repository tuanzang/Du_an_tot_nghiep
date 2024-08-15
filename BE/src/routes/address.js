import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  findAddressById,
  getAddressByIdUser,
  updateAddress,
} from "../controller/address";

const addressRouter = Router();

addressRouter.post("/", getAddressByIdUser);
addressRouter.post("/add", createAddress);
addressRouter.post("/update", updateAddress);
addressRouter.post("/delete/:id", deleteAddress);
addressRouter.get("/:id", findAddressById);

export default addressRouter;
