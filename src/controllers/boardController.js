import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    // console.log("req.body: ", req.body); //Dữ liệu gửi trong body (thường là JSON, ví dụ: { "title": "My Board" }).
    // console.log("req.query: ", req.query); //Tham số query trong URL (ví dụ: /boards?id=123 → req.query.id = "123").
    // console.log("req.params: ", req.params); //Tham số trong route (ví dụ: /boards/:id → req.params.id).
    // console.log("req.files: ", req.files); //File tải lên (nếu có).
    // console.log("req.cookies: ", req.cookies); //Cookie gửi từ client.
    // console.log("req.jwtDecoded: ", req.jwtDecoded); //Dữ liệu JWT đã giải mã (nếu có middleware xác thực).

    //===================================================================================
    //req (Request): Là đối tượng đại diện cho HTTP request từ client.
    // res (Response): Là đối tượng để gửi phản hồi (response) về client
    // res.status(200): Đặt mã trạng thái HTTP.
    // res.json({ message: "OK" }): Gửi dữ liệu JSON.
    // res.send("Hello"): Gửi dữ liệu thô.
    // next: Là một hàm callback để chuyển điều khiển sang middleware/route tiếp theo trong chuỗi xử lý.
    //===================================================================================

    //Điều hướng dữ liệu sang tầng Service
    const createBoard = await boardService.createNew(req.body);

    // throw new ApiError(StatusCodes.BAD_GATEWAY, "loi");

    //Có kết quả thì trả về phía Client
    //Controller là nơi CUỐI CÙNG trong chuỗi xử lý request, nó PHẢI trả về response cho client
    res.status(StatusCodes.CREATED).json(createBoard);
  } catch (error) {
    // console.log(error);

    next(error);

    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message,
    // });
  }
};

const getDetails = async (req, res, next) => {
  try {
    // console.log("req.params: ", req.params);
    const boardId = req.params.id; // Lấy boardId từ params của request
    const board = await boardService.getDetails(boardId); // Gọi service để lấy thông tin chi tiết board
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updateBoard = await boardService.update(boardId, req.body);

    res.status(StatusCodes.OK).json(updateBoard);
  } catch (error) {
    next(error);
  }
};
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
};
