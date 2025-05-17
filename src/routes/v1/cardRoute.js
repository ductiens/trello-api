import express from "express";
import { cardValidation } from "~/validations/cardValidation";
import { cardController } from "~/controllers/cardController";

const Router = express.Router();

// Route cho danh sách card
Router.route("/")
  .post(cardValidation.createNew, cardController.createNew); //Gọi middleware cardValidation.createNew để kiểm
// tra dữ liệu, sau đó gọi cardController.createNew để xử lý.

export const cardRoute = Router;
