import category from "../models/category.js";
import Option from "../models/option.js";

export const getAllCategory = async (req, res) => {
  const { loai, status, page = 1 } = req.body;
  const pageSize = 5;

  try {
    let query = {};

    if (status) {
      query.status = status;
    }

    if (loai) {
      query.loai = { $regex: loai, $options: "i" };
    }
    const totalCategories = await category.countDocuments(query);
    const data = await category
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy danh sách danh mục!",
        data: [],
        total: 0,
        size: pageSize,
      });
    }

    return res.status(200).json({
      message: "Danh sách danh mục",
      data: data,
      total: totalCategories,
      size: pageSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getDetailCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const data = await category.findById(categoryId);
    const options = await Option.find({ category: categoryId }).exec();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh muc !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy danh muc",
      data: {
        ...data.toJSON(),
        options,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { loai, options } = req.body;

    // create category
    const data = await category.create({ loai });

    // create options
    const optionFormat = options.map((it) => ({ ...it, category: data._id }));
    const optionCreated = await Option.insertMany(optionFormat);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Tạo danh mục thất bại!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Tạo danh muc thành công ",
      data: {
        category: data,
        option: optionCreated,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { options, ...rest } = req.body;
    const data = await category.findByIdAndUpdate(categoryId, rest, {
      new: true,
    });

    const updateOptionPromise = options.map(async (it) => {
      const optionUpdated = await Option.findByIdAndUpdate(it._id, it, {
        new: true,
      });
      return optionUpdated;
    });

    const optionUpdated = await Promise.all(updateOptionPromise);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Update danh mục thất bại !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Update danh mục thành công",
      data: {
        ...data.toJSON(),
        options: optionUpdated,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  const { _id, status } = req.body;

  if (!_id || status === undefined) {
    return res.status(400).json({
      message: "Thiếu thông tin cần thiết để cập nhật!",
    });
  }

  try {
    const data = await category.findByIdAndUpdate(
      _id,
      { status }, // Chỉ cập nhật trường status
      { new: true } // Trả về bản ghi đã cập nhật
    );

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục để cập nhật!",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái danh mục thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
