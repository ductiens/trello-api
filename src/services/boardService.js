/* eslint-disable no-useless-catch */

import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới thằng Model để sử lý bản ghi newBoard trong database
    const createdBoard = await boardModel.createNew(newBoard);
    // createBoard = {
    //   acknowledged: true,
    //   insertedId: "507f1f77bcf86cd799439011"
    // }

    //Lấy bản ghi board sau khi gọi (tùy mục đích dự án xem có cần bước này hay không) - Lấy thông tin board vừa tạo bằng insertedId
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    // getNewBoard = {
    //   _id: "507f1f77bcf86cd799439011",
    //   title: "My Board",
    //   description: "Description",
    //   // ... các thông tin khác
    // }

    //Làm thêm các sử lý logic khác với các Collection khác tùy đặc thù dự án
    //Bắn email, notification về cho admin khi có 1 board mới đc tạo

    //Trả về kết quả, trong Services luôn phải có return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    return board;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
};
