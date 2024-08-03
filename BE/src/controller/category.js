import category from "../models/category.js";
import Option from "../models/option.js"

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
        options
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
    const optionFormat = options.map(it => ({...it, category: data._id}));
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
        option: optionCreated
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

    // remove old options
    await Option.deleteMany({ category: categoryId }).exec()

    // add new options
    const optionFormat = options.map(it => ({...it, category: categoryId}));
    const optionCreated = await Option.insertMany(optionFormat);

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
        options: optionCreated
      },
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
