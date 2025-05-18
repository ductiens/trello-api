import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardValidation } from "~/validations/boardValidation";
import { boardController } from "~/controllers/boardController";

const Router = express.Router();

// Route cho danh sách boards và tạo board mới
Router.route("/")
  .get((req, res) => {
    // GET /v1/boards
    res.status(StatusCodes.OK).json({ message: "GET: list board" });
  })
  .post(boardValidation.createNew, boardController.createNew); //Gọi middleware boardValidation.createNew để kiểm
// tra dữ liệu, sau đó gọi boardController.createNew để xử lý.

// Route cho các thao tác với board cụ thể
Router.route("/:id")
  .get(boardController.getDetails) // GET /v1/boards/:id
  .put(boardValidation.update, boardController.update); //update : PUT /v1/boards/:id

// API hỗ trợ việc di chuyển card giữa các column khác nhau trong 1 board
Router.route("/supports/moving_card").put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
);

export const boardRoute = Router;
