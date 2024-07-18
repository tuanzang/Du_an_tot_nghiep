import transaction from "../models/transaction";

/**
 * Tìm kiếm lịch sử thanh toán
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getTransBillByIdBill = async (req, res) => {
  try {
    const data = await transaction
      .find({ idBill: req.body.idBill })
      .sort("-createdAt");
    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy lịch sử thanh toán !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy lịch sử thanh toán!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API thanh toán
 * @param req
 * @param res
 * @returns
 */
export const createTransBill = async (req, res) => {
  try {
    const data = await transaction.create(req.body);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Tạo thanh toán thất bại!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Tạo thanh toán thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API tìm kiếm và cập nhật lịch sử thanh toán
 * @param req
 * @param res
 * @returns
 */
export const findAndUpdateTransBill = async (req, res) => {
  try {
    // Tìm giao dịch gần nhất
    const recentTransaction = await transaction
      .findOne()
      .sort({ createdAt: -1 });

    if (!recentTransaction) {
      return res.status(404).json({
        message: "Không tìm thấy giao dịch nào!",
        data: [],
      });
    }

    // Kiểm tra trạng thái của giao dịch
    if (recentTransaction.status === false) {
      return res.status(200).json({
        message: "Giao dịch gần nhất đã có trạng thái là false",
        data: recentTransaction,
      });
    }

    // Nếu trạng thái là true, đổi thành false và lưu lại
    recentTransaction.status = false;
    await recentTransaction.save();

    return res.status(200).json({
      message: "Cập nhật trạng thái giao dịch thành công",
      data: recentTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
