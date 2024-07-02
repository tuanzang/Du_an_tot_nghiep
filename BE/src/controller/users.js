import User from "../models/user.js";

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
