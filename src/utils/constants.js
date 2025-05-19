//Những domain đc truy cập tới tài nguyên của Server
export const WHITELIST_DOMAINS = [
  // "http://localhost:5173", //không cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường env.BUILD_MODE === "dev"
  //...vv ví dụ sau này sẽ deploy lên domain chính thức ...vv
  "https://trello-web-omega-five.vercel.app/",
];

export const BOARD_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private",
};
