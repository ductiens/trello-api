/**
 * config
 *
 * carinandt
 * YTW9Y1NPWsGaH5F3
 *
 */

import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

// Khi tạo 1 đối tượng trelloDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let trelloDatabaseInstance = null;

//Khởi tạo 1 đối tượng MongoClientInstance để connect tới mongodb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  //Lưu ý: Cái serverApi có từ phiên bản 5.0.0 trở lên, có thể không cần dùng nó, còn nếu dùng nó là chúng ta
  //sẽ chỉ định 1 cái Stable API Version của MongoDB
  //https://www.mongodb.com/docs/drivers/node/v6.0/fundamentals/connection/connect/
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Kết nối tới Database
export const CONNECT_DB = async () => {
  //Gọi kết nối tới Mongo Atlas với URI đã đc khai báo trong mongoClientInstance
  await mongoClientInstance.connect();

  //Kết nối thành công thì lấy database theo tên và gán ngược lại vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

//Đóng kết nối database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};

//Function GET_DB (không async) có nhiệm vụ export ra trelloDatabaseInstance sau khi đã connect thành công tới
//mongodb để chúng ta sử dụng ở nhiều nơi khác nhau trong code
//Lưu ý: Chỉ luôn gọi GET_DB sau khi kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error("Must connect to Database first");
  return trelloDatabaseInstance;
};
