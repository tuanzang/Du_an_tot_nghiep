import User from "../models/user.js";
import bcryptjs from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const data = await User.find().sort("-createdAt");

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

export const updateRoleUser = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({
      message: "Thiếu thông tin userId hoặc role",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "Người dùng không tìm thấy",
      });
    }

    res.json({
      message: "Cập nhật vai trò thành công",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({
      message: "Thiếu thông tin userId hoặc password",
    });
  }

  try {
    // Băm mật khẩu mới
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Cập nhật mật khẩu người dùng
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "Người dùng không tìm thấy",
      });
    }

    res.json({
      message: "Cập nhật mật khẩu thành công",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const blockUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "Thiếu thông tin userId",
    });
  }

  try {
    const blockedUser = await User.findByIdAndUpdate(
      userId,
      { blocked: true },
      { new: true, runValidators: true }
    );

    if (!blockedUser) {
      return res.status(404).json({
        message: "Người dùng không tìm thấy",
      });
    }

    res.json({
      message: "Mở khóa người dùng thành công",
      data: blockedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const unlockUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { blocked: false, status: "active" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy User" });
    }

    res.status(200).json({ message: "Bỏ chặn thành công", data: updatedUser });
  } catch (error) {
    console.error("Error unlocking user:", error);
    res.status(500).json({ message: "Bỏ chặn không thành công" });
  }
};

export const findUserById = async (req, res) => {
  try {
    const user = await User.findById(req.body._id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy User" });
    }

    res.status(200).json({ message: "Bỏ chặn thành công", data: user });
  } catch (error) {
    console.error("Error unlocking user:", error);
    res.status(500).json({ message: "Bỏ chặn không thành công" });
  }
};
