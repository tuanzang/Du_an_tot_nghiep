import { Router } from "express";
import { blockUser, getAllUsers, unlockUser, updateRoleUser } from "../controller/users.js";
import { checkAuth } from "../middleware/checkAuth.js";

const productRouter = Router();

productRouter.get("/", checkAuth, getAllUsers);
productRouter.patch("/:userId", updateRoleUser);
productRouter.patch("/block/:userId", blockUser);
productRouter.patch("/unlock/:userId", unlockUser);

export default productRouter;
