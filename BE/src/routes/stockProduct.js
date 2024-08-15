import express from "express";
import { getStockProducts } from "../controller/stockProduct.js";

const stockOrderRouter = express.Router();

stockOrderRouter.get("/stock-products", getStockProducts);

export default stockOrderRouter;   