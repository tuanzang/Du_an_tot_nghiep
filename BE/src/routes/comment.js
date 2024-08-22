import { Router } from "express";
import {
  createComment,
  deleteComment,
  detailByUserAndProductSize,
  detailComment,
  findAllProduct,
  findAllUser,
  findProductSizeById,
  getAllComment,
  getCommentByIdProduct,
  // updateComment,
} from "../controller/comment.js";

const commentRouter = Router();

commentRouter.post("/", getAllComment);
commentRouter.post("/findByIdProduct", getCommentByIdProduct);
commentRouter.post("/add", createComment);
// commentRouter.post("/update", updateComment);
commentRouter.post("/delete", deleteComment);
commentRouter.post("/detail/:id", detailComment);
commentRouter.post("/detailByUserAndProductSize", detailByUserAndProductSize);
commentRouter.get("/allUser", findAllUser);
commentRouter.get("/allProduct", findAllProduct);
commentRouter.post("/findProductSizeById", findProductSizeById);

export default commentRouter;
