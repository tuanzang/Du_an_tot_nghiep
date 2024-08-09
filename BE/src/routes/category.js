import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getDetailCategory,
  updateCategory,
} from "../controller/category.js";

const categoryRouter = Router();

categoryRouter.post("/", getAllCategory);
categoryRouter.get("/:id", getDetailCategory);
categoryRouter.post("/add", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.post("/delete", deleteCategory);

export default categoryRouter;
