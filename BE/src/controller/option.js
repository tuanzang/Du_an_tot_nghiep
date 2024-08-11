import Option from "../models/option.js";

// Thêm một tùy chọn mới
export const addOption = async (req, res) => {
  try {
    const { category, nameoption, quantityoption, priceoption, status, image } =
      req.body;

    // Tạo một đối tượng tùy chọn mới
    const newOption = new Option({
      category,
      nameoption,
      quantityoption,
      priceoption,
      status,
      image,
    });

    // Lưu đối tượng tùy chọn mới vào cơ sở dữ liệu
    await newOption.save();

    return res.status(201).json({
      success: true,
      message: "Tùy chọn đã được tạo thành công",
      data: newOption,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};

// Cập nhật một tùy chọn hiện có
export const updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, nameoption, quantityoption, priceoption, status } =
      req.body;

    // Tìm tùy chọn theo ID và cập nhật
    const updatedOption = await Option.findByIdAndUpdate(
      id,
      { category, nameoption, quantityoption, priceoption, status },
      { new: true }
    );

    if (!updatedOption) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tùy chọn",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tùy chọn đã được cập nhật thành công",
      data: updatedOption,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};

// Xóa một tùy chọn
export const deleteOption = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm tùy chọn theo ID và xóa
    const deletedOption = await Option.findByIdAndDelete(id);

    if (!deletedOption) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tùy chọn",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tùy chọn đã được xóa thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};

export const getOptionsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const options = await Option.find({ category: categoryId }).exec();

    res.json({
      message: "Get option successfully",
      data: options,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
