import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRoute } from "~/routes/v1/boardRoute";
import { columnRoute } from "~/routes/v1/columnRoute";
import { cardRoute } from "~/routes/v1/cardRoute";

const Router = express.Router();

// === Check APIs v1/status ===
//Router.get(path, callback);
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs v1 ready" });
});

// === Board APIs ===
//Router.use([path], middleware); là phương thức để đăng ký một middleware hoặc router áp dụng cho tất cả
//phương thức HTTP (GET, POST, PUT, ...) trên một đường dẫn
Router.use("/boards", boardRoute);

// === Column APIs ===
Router.use("/columns", columnRoute);

// === Card APIs ===
Router.use("/cards", cardRoute);


export const APIs_V1 = Router;
