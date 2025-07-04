/**
 * config
 */
import { WHITELIST_DOMAINS } from "~/utils/constants";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

// Cấu hình CORS Option
export const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined
    // if (!origin && env.BUILD_MODE === "dev") {
    //Nếu môi trường là local dev thì cho qua luôn
    if (env.BUILD_MODE === "dev") {
      //Nếu origin là undefined và môi trường dev thì cho đi qua
      return callback(null, true);
    }

    //Ngược lại là môi trường  env.BUILD_MODE === "production"

    // Kiểm tra xem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`));
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  credentials: true,
};
