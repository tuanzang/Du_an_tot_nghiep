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
  const { idUser, idBill, creator, role, statusBill } = req.body;

  // Các điều kiện xác thực
  if (!idUser) {
    return res.status(200).json({
      message: "Thiếu thông tin người thực hiện!",
      success: false,
    });
  }

  if (!idBill) {
    return res.status(200).json({
      message: "Thiếu thông tin hóa đơn!",
      success: false,
    });
  }

  if (!creator) {
    return res.status(200).json({
      message: "Thiếu tên người thực hiện!",
      success: false,
    });
  }

  if (creator && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(creator)) {
    return res.status(200).json({
      message: "Tên người thực hiện không được chứa ký tự đặc biệt.",
      success: false,
    });
  }

  if (!statusBill) {
    return res.status(200).json({
      message: "Thiếu thông tin trạng thái hóa đơn!",
      success: false,
    });
  }

  if (!role) {
    return res.status(200).json({
      message: "Thiếu thông tin vai trò người thực hiện!",
      success: false,
    });
  }

  if (role && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(role)) {
    return res.status(200).json({
      message: "Vai trò người thực hiện không được chứa ký tự đặc biệt.",
      success: false,
    });
  }

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
