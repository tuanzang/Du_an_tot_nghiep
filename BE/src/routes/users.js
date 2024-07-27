import { Router } from "express";
import {
  blockUser,
  getAllUsers,
  unlockUser,
  updatePassword,
  updateRoleUser,
} from "../controller/users.js";
import { checkAuth } from "../middleware/checkAuth.js";

const userRouter = Router();

userRouter.get("/", checkAuth, getAllUsers);
userRouter.patch("/:userId", updateRoleUser);
userRouter.post("/updatePassword", updatePassword);
userRouter.patch("/block/:userId", blockUser);
userRouter.patch("/unlock/:userId", unlockUser);

export default userRouter;
