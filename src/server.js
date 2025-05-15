/* eslint-disable no-console */
import express from "express";
import { CONNECT_DB, CLOSE_DB, GET_DB } from "~/config/mongodb";

import exitHook from "async-exit-hook";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";

import cors from "cors";
import { corsOptions } from "~/config/cors";

const START_SERVER = () => {
  const app = express();

  //Xử lý CORS
  app.use(cors(corsOptions));

  // app.get("/", async (req, res) => {
  //   console.log(await GET_DB().listCollections().toArray());
  //   res.end("<h1>Hello World!</h1><hr>");
  // });

  //Enable (bật) req.body json data
  //Kích hoạt middleware để parse body JSON.
  app.use(express.json());

  //Use APIs v1
  app.use("/v1", APIs_V1);

  //Middleware xử lý lỗi tập trung. Express sẽ tìm middleware xử lý lỗi đầu tiên được đăng ký với 4 tham số
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`);
  });

  //Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log("4. Disconnecting from MongoDB Cloud Atlas !");
    CLOSE_DB();
    console.log("5. Disconnected from MongoDB Cloud Atlas !");
  });
};

//Cách 1: Chỉ khi kết nối database thành công thì mới start server back-end lên
// CONNECT_DB()
//   .then(() => console.log("Connect to MongoDB Cloud Atlas!"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });

//Cách 2: IIFE - Chỉ khi kết nối database thành công thì mới start server back-end lên
(async () => {
  try {
    console.log("1. Connecting to MongoDB Cloud Atlas...");
    await CONNECT_DB();
    console.log("2. Connected to MongoDB Cloud Atlas!");
    START_SERVER(); //Khởi động khi connect server database thành công
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
