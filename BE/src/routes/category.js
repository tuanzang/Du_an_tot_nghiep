import { Router } from "express";
import {
  createCategory,
  getAllCategory,
  getDetailCategory,
  getPageCategory,
  updateCategory,
} from "../controller/category.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/page", getPageCategory);
categoryRouter.get("/:id", getDetailCategory);
categoryRouter.post("/add", createCategory);
categoryRouter.put("/:id", updateCategory);

export default categoryRouter;
