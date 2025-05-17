import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardValidation } from "~/validations/boardValidation";
import { boardController } from "~/controllers/boardController";

const Router = express.Router();

// Route cho danh sách board
Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "GET: list board" });
  })
  .post(boardValidation.createNew, boardController.createNew); //Gọi middleware boardValidation.createNew để kiểm
// tra dữ liệu, sau đó gọi boardController.createNew để xử lý.

// Route cho một board cụ thể
Router.route("/:id")
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update); //update

export const boardRoute = Router;
