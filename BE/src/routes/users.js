import { Router } from "express";
import { getAllUsers } from "../controller/users.js";
import { checkAuth } from "../middleware/checkAuth.js";

const productRouter = Router();

productRouter.get("/", checkAuth, getAllUsers);

export default productRouter;
