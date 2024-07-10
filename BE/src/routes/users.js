import { Router } from "express";
import { findUserById, getAllUsers } from "../controller/users.js";
import { checkAuth } from "../middleware/checkAuth.js";

const productRouter = Router();

productRouter.get("/", checkAuth, getAllUsers);
productRouter.post("/findUserById", findUserById);

export default productRouter;
