import historyBill from "../models/historyBill";

/**
 * Tìm kiếm lịch sử đơn hàng
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getHistoryBillByIdBill = async (req, res) => {
  try {
    const data = await historyBill
      .find({ idBill: req.body.idBill })
      .sort("createdAt");
    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy lịch sử đơn hàng !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy lịch sử đơn hàng!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API tạo lịch sử đơn hàng
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const createHistoryBill = async (req, res) => {
  try {
    const data = await historyBill.create(req.body);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Tạo lịch sử thất bại!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Tạo lịch sử thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
