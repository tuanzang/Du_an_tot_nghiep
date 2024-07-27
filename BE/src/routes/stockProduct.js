import express from "express";
import { getStockProducts } from "../controller/stockProduct";

const stockOrderRouter = express.Router();

stockOrderRouter.get("/stock-products", getStockProducts);

export default stockOrderRouter;   