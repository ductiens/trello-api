/* eslint-disable no-useless-catch */

import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới thằng Model để sử lý bản ghi newBoard trong database
    const createdBoard = await boardModel.createNew(newBoard)

    //Lấy bản ghi board sau khi gọi (tùy mục đích dự án xem có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    //Làm thêm các sử lý logic khác với các Collection khác tùy đặc thù dự án
    //Bắn email, notification về cho admin khi có 1 board mới đc tạo

    //Trả về kết quả, trong Services luôn phải có return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
