import Size from "../models/size.js";

export const createSize = async (req, res) => {
  try {
    const { sizeCode, name, status } = req.body;

    // Các điều kiện xác thực
    if (!sizeCode) {
      return res.status(200).json({
        success: false,
        message: "Mã kích cỡ không được để trống",
      });
    }

    if (!/^[\p{L}\p{N}\s.,!?-]+$/u.test(sizeCode)) {
      return res.status(200).json({
        success: false,
        message: "Mã kích cỡ không được chứa ký tự đặc biệt.",
      });
    }

    if (!name) {
      return res.status(200).json({
        success: false,
        message: "Tên kích cỡ không được để trống",
      });
    }

    if (!/^[\p{L}\p{N}\s.,!?-]+$/u.test(name)) {
      return res.status(200).json({
        success: false,
        message: "Tên kích cỡ không được chứa ký tự đặc biệt.",
      });
    }

    // Kiểm tra trùng lặp
    const existingSizeCode = await Size.findOne({ sizeCode });
    if (existingSizeCode) {
      return res.status(200).json({
        success: false,
        message: "Mã kích cỡ đã tồn tại",
      });
    }

    const existingSizeName = await Size.findOne({ name });
    if (existingSizeName) {
      return res.status(200).json({
        success: false,
        message: "Tên kích cỡ đã tồn tại",
      });
    }

    const data = await Size.create({ sizeCode, name, status });
    return res.status(200).json({
      success: true,
      message: "Thêm size thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSize = async (req, res) => {
  const { _id, name } = req.body;

  // Các điều kiện xác thực
  if (!_id) {
    return res.status(200).json({
      message: "Thiếu thông tin cần thiết để cập nhật!",
      success: false,
    });
  }

  if (name && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(name)) {
    return res.status(200).json({
      message: "Tên kích cỡ không được chứa ký tự đặc biệt.",
      success: false,
    });
  }

  try {
    // Tìm kích cỡ hiện tại để lấy tên
    const currentSize = await Size.findById(_id);
    if (!currentSize) {
      return res.status(404).json({
        message: "Không tìm thấy kích cỡ để cập nhật!",
        success: false,
      });
    }

    // Nếu tên mới khác tên hiện tại, kiểm tra trùng lặp
    if (name && name !== currentSize.name) {
      const existingSize = await Size.findOne({ name });
      if (existingSize) {
        return res.status(200).json({
          message: "Tên kích cỡ đã tồn tại.",
          success: false,
        });
      }
    }

    const data = await Size.findByIdAndUpdate(
      _id,
      { name }, // Chỉ cập nhật trường có giá trị
      { new: true } // Trả về bản ghi đã cập nhật
    );

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy kích cỡ để cập nhật!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật kích cỡ thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getAllSize = async (req, res) => {
  const { name, status, page = 1 } = req.body;
  const pageSize = 5;
  try {
    let query = {};

    if (status) {
      query.status = status;
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const totalSizes = await Size.countDocuments(query);
    const data = await Size.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy danh sách size !",
        data: [],
        total: 0,
        size: pageSize,
      });
    }

    return res.status(200).json({
      message: "Danh sách size",
      data: data,
      total: totalSizes,
      size: pageSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSize = async (req, res) => {
  const { _id, status } = req.body;

  if (!_id || status === undefined) {
    return res.status(406).json({
      message: "Thiếu thông tin cần thiết để cập nhật!",
    });
  }

  try {
    const data = await Size.findByIdAndUpdate(
      _id,
      { status }, // Chỉ cập nhật trường status
      { new: true } // Trả về bản ghi đã cập nhật
    );

    if (!data) {
      res.status(404).json({
        message: "Không tìm thấy kích cỡ để cập nhật !",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Cập nhật kích cỡ thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const findSizeById = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(406).json({
        message: "Thiếu thông tin cần thiết để tìm kiếm!",
      });
    }

    const size = await Size.findById(_id);

    if (!size) {
      return res.status(404).json({
        message: "Không tìm thấy kích cỡ",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Tìm thấy kích cỡ thành công",
      data: size,
    });
  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      message: error.message,
    });
  }
};
