/* eslint-disable no-useless-catch */

import { slugify } from "~/utils/formatters";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới thằng Model để sử lý bản ghi newBoard trong database

    //Làm thêm các sử lý logic khác với các Collection khác tùy đặc thù dự án
    //Bắn email, notification về cho admin khi có 1 board mới đc tạo

    //Trả về kết quả, trong Services luôn phải có return
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
