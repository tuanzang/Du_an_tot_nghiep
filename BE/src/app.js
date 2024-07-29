import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
// import authRouter from "./routes/authRouter";
import mongoose from "mongoose";
import router from "./routes/index.js";
import { createServer } from "node:http";
import initialSocket from "./socket/index.js";

const app = express();
const server = createServer(app);
const port = 3001;
dotenv.config();
// middleware
app.use(express.json());
app.use(cors());

// connect db
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Connected db failed");
  });
// routers
app.use("/api", router);

// socket
initialSocket(server);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export const viteNodeApp = app;
// em reta
//kih nao loi e là sao thế a  loi say ra khi naokhi mình k thể lấy dduocj dữ liệu bên mongodb. demo a xem
// ở bên này e có hết data nhma k thể render ra màn hình tự nhiên bây giờ lại nhận giữ liệu a ạ
