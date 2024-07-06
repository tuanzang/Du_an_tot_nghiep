import { Router } from "express";
import {
  createComment,
  deleteComment,
  detailComment,
  findAllProduct,
  findAllUser,
  findUserById,
  getAllComment,
  getCommentByIdProduct,
  updateComment,
} from "../controller/comment";

const commentRouter = Router();

commentRouter.post("/", getAllComment);
commentRouter.post("/findByIdProduct", getCommentByIdProduct);
commentRouter.post("/add", createComment);
commentRouter.post("/update", updateComment);
commentRouter.post("/delete", deleteComment);
commentRouter.post("/detail", detailComment);
commentRouter.post("/findUserById", findUserById);
commentRouter.get("/allUser", findAllUser);
commentRouter.get("/allProduct", findAllProduct);

export default commentRouter;
