import { Router } from "express";
import { createCategory, deleteCategory, getAllCategory, getDetailCategory, updateCategory } from "../controller/category";

const categoryRouter = Router();

categoryRouter.get('/', getAllCategory);
categoryRouter.get('/:id', getDetailCategory);
categoryRouter.post("/add", createCategory);
categoryRouter.put('/:id', updateCategory);
categoryRouter.get('/:id', deleteCategory);

export default categoryRouter