import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRoute } from "~/routes/v1/boardRoute";

const Router = express.Router();

// === Check APIs v1/status ===
//Router.get(path, callback);
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs v1 ready" });
});

// === Board APIs ===
//Router.use([path], middleware); à phương thức để đăng ký một middleware hoặc router áp dụng cho tất cả 
//phương thức HTTP (GET, POST, PUT, ...) trên một đường dẫn
Router.use("/boards", boardRoute);

export const APIs_V1 = Router;
