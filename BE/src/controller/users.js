import user from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const data = await user.find().sort("-createdAt");

    res.json({
      message: "Danh sách User",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API tìm kiếm thông tin tài khoản
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const findUserById = async (req, res) => {
  try {
    const data = await user.findById(req.body._id);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy tài khoản",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
