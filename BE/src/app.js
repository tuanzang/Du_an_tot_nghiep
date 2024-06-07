import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import router from "./routes";
import mongoose from "mongoose";

const app = express();
const port = 3001;
dotenv.config();
// middleware
app.use(express.json());
app.use(cors());

// connect db
mongoose 
    .connect(process.env.DB_URI)
    .then(() => {
        console.log("Connected to db")
    })
    .catch ((err) => {
        console.log("Connected db failed")
    });
// routers
app.use("/api", router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

export const viteNodeApp = app;
