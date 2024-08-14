import category from "../models/category.js";
import Option from "../models/option.js";

export const getAllCategory = async (req, res) => {
  try {
    const data = await category.find();

    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy danh sách danh mục!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách danh mục",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getPageCategory = async (req, res) => {
  const { loai, page = 1 } = req.body;
  const pageSize = 5;

  try {
    let query = {};

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

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh muc !",
        data: null,
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

    if (!data) {
      return res.status(404).json({
        message: "Tạo danh mục thất bại!",
        data: null,
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

    const currentOptions = await Option.find({ category: categoryId }).exec();
    const newOptionIds = options
      .filter((it) => it._id)
      .map((it) => it._id.toString());

    const deletedOption = currentOptions.filter(
      (it) => !newOptionIds.includes(it._id.toString())
    );

    await Promise.all(
      deletedOption.map((it) => Option.findByIdAndDelete(it._id))
    );

    const updateOptionPromise = options.map(async (it) => {
      let optionUpdateOrCreate = await Option.findByIdAndUpdate(it._id, it, {
        new: true,
      });

      if (!optionUpdateOrCreate) {
        optionUpdateOrCreate = await new Option({
          ...it,
          category: categoryId,
        }).save();
      }

      return optionUpdateOrCreate;
    });

    const optionUpdated = await Promise.all(updateOptionPromise);

    if (!data) {
      return res.status(404).json({
        message: "Update danh mục thất bại !",
        data: null,
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
