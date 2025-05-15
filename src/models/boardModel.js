import Joi from "joi";
import { ObjectId } from "mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { GET_DB } from "~/config/mongodb";

// Define Collection-Table (name & schema)
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
  //Chỉ định abortEarly: false để trường hợp có nhiều lỗi Validation thì trả về tất cả lỗi
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    // Thêm board vào database - Collection trong MongoDB tương đương với table trong SQL
    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData);
    return createBoard;
  } catch (error) {
    throw new Error(error);
  }
};

// Hàm tìm board theo ID
const findOneById = async (id) => {
  try {
    // console.log(id);
    // const testId = new ObjectId(String(id));
    // console.log(testId);

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(id)),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//Query tổng hợp (aggregate) để lấy toàn bộ Column và Cards thuộc về Boards
const getDetails = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(id)),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
};
