import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  /**Note: Mặc định chúng ta không cần phải custom message ở phía Back-End làm gì vì để cho Front-End tự validate và custom
   * message phía Front-End cho đẹp
   * Back-End chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là đc
   * Quan trọng: Việc Validate dữ liệu bắt buộc phải có ở Back-End vì đây là điểm cuối để lưu trữ dữ liệu vào database
   * Và thông thường trong thực tế, điều tốt nhất trong hệ thống là hãy luôn validate dữ liệu ở cả Back-End và Front-End
   */

  //Định nghĩa schema Joi để kiểm tra req.body
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required!!",
      "string.empty": "Title is not allowed to be empty",
      "string.max": "Title length must be less than or equal to 50 characters long",
      "string.min": "Title length must be at least 3 characters long",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    // type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
    type: Joi.string()
      .valid(...Object.values(BOARD_TYPES))
      .required(),
  });

  //Kiểm tra dữ liệu req.body theo schema:
  try {
    // console.log("req.body: ", req.body);

    //Chỉ định abortEarly: false để trường hợp có nhiều lỗi Validation thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false });

    //Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang Controller
    next(); //next() sẽ chạy sang tầng tiếp theo là boardController.createNew

    // res.status(StatusCodes.CREATED).json({ message: "POST from Validation: create new board" });
  } catch (error) {
    // console.log(error);
    // console.log(new Error(error));
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    //   errors: new Error(error).message,
    // });

    const errorMessage = new Error(error).message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};

const update = async (req, res, next) => {
  //Lưu ý: Không dùng required() trong trường hợp update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(...Object.values(BOARD_TYPES)),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
  });

  try {
    //Chỉ định abortEarly: false để trường hợp có nhiều lỗi Validation thì trả về tất cả lỗi
    //allowUnknown là mình được đẩy thêm fields ngoài những field đã định nghĩa trong correctCondition
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true });
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};

export const boardValidation = {
  createNew,
  update,
};
