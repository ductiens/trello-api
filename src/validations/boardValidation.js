import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  /**Note: Mặc định chúng ta không cần phải custom message ở phía Back-End làm gì vì để cho Front-End tự validate và custom
   * message phía Front-End cho đẹp
   * Back-End chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là đc
   * Quan trọng: Việc Validate dữ liệu bắt buộc phải có ở Back-End vì đây là điểm cuối để lưu trữ dữ liệu vào database
   * Và thông thường trong thực tế, điều tốt nhất trong hệ thống là hãy luôn validate dữ liệu ở cả Back-End và Front-End
   */

  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required!!",
      "string.empty": "Title is not allowed to be empty",
      "string.max": "Title length must be less than or equal to 50 characters long",
      "string.min": "Title length must be at least 3 characters long",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
  });

  try {
    // console.log("req.body: ", req.body);

    //Chỉ định abortEarly: false để trường hợp có nhiều lỗi Validation thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // next()

    res.status(StatusCodes.CREATED).json({ message: "POST from Validation: create new board" });
  } catch (error) {
    // console.log(error);
    // console.log(new Error(error));
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};

export const boardValidation = {
  createNew,
};
