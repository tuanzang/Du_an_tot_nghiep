import express from "express";
import { getTopOrderedProducts } from "../controller/topOrder";

const topOrderRouter = express.Router();

topOrderRouter.get("/top-ordered-products", getTopOrderedProducts);

export default topOrderRouter;