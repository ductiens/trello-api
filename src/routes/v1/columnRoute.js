import express from "express";
import { columnValidation } from "~/validations/columnValidation";
import { columnController } from "~/controllers/columnController";

const Router = express.Router();

// Route cho danh sách column
Router.route("/")
  .post(columnValidation.createNew, columnController.createNew); //Gọi middleware columnValidation.createNew để kiểm
// tra dữ liệu, sau đó gọi columnController.createNew để xử lý.

Router.route("/:id")
  .put(columnValidation.update, columnController.update); //update : PUT /v1/column/:id

export const columnRoute = Router;
