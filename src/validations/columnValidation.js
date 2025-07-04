import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  // console.log("Request body:", req.body);
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    // console.log("Validation error:", error);
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const update = async (req, res, next) => {
  //Lưu ý: Không dùng required() trong trường hợp update
  const correctCondition = Joi.object({
    //Nếu cần làm tính năng di chuyển Column sang Board khác thì mới thêm validate boardId
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
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

const deleteItem = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  });

  try {
    await correctCondition.validateAsync(req.params);
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};

export const columnValidation = {
  createNew,
  update,
  deleteItem,
};
