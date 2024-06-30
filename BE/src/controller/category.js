import category from "../models/category.js";

export const getAllCategory = async (req, res) => {
  try {
    const data = await category.find();
    if (!data || data.length === 0) {
     return res.status(404).json({
        message: "Không tìm thấy danh sách danh muc !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách danh muc",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getDetailCategory = async (req, res) => {
  try {
    const data = await category.findById(req.params.id);
    if (!data || data.length === 0) {
       return res.status(404).json({
        message: "Không tìm thấy danh muc !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy danh muc",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = await category.create(req.body);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Tạo danh mục thất bại!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Tạo danh muc thành công ",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const data = await category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data || data.length === 0) {
       return res.status(404).json({
        message: "Update danh mục thất bại !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Update danh mục thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const data = await category.findByIdAndDelete(req.params.id);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Delete danh mục thất bại !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Delete danh mục thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
