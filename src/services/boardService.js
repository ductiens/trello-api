/* eslint-disable no-useless-catch */

import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";

import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới thằng Model để sử lý bản ghi newBoard trong database(Gọi model để tạo board trong database)
    const createdBoard = await boardModel.createNew(newBoard);
    // createBoard = {
    //   acknowledged: true,
    //   insertedId: "507f1f77bcf86cd799439011"
    // }

    //Lấy bản ghi board sau khi gọi (tùy mục đích dự án xem có cần bước này hay không) - Lấy thông tin board vừa tạo bằng insertedId
    // Lấy thông tin chi tiết của board vừa tạo
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    // getNewBoard = {
    //   _id: "507f1f77bcf86cd799439011",
    //   title: "My Board",
    //   description: "Description",
    //   // ... các thông tin khác
    // }

    //Làm thêm các sử lý logic khác với các Collection khác tùy đặc thù dự án
    //Bắn email, notification về cho admin khi có 1 board mới đc tạo

    //Trả về kết quả, trong Services luôn phải có return. Controller cần dữ liệu này để trả về cho client
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

    //Cần tổ chức lại để cards nằm trong column tương ứng
    //B1: Deep Clone board ra 1 cái mới để xử lý, không ảnh hưởng tới cái board ban đầu, tùy mục đích về sau có cần clone deep
    //hay không
    const resBoard = cloneDeep(board);
    //B2: Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      //Vì columnId, _id là ObjectId nên phải chuyển sang string. Còn equals đc mongodb hỗ trợ
      // column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString()); //C1
      column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id)); //C2
    });
    //B3: Xóa mảng card khỏi board ban đầu
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // B1: cập nhật mảng cardOrderIds của column ban đầu chứa nó (Nghĩa là xóa cái _id của Card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });
    // B2: Cập nhật mảng cardOrderIds của column tiếp theo (Thêm _id card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });
    // B3: Cập nhật lại trường columnId mới của Card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    });

    return {
      updateResult: "Successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
};
