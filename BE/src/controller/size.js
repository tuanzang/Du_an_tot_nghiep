import Size from "../models/size.js";

export const createSize = async (req, res) => {
  try {
    const data = await Size.create(req.body);
    if (!data || data.length === 0) {
      res.status(404).json({
        message: "Thêm size thất bại!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Thêm size thành công ",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllSize = async (req, res) => {

  try {
    const data = await Size.find()
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách size !",
        data: []
      })
    }

    return res.status(200).json({
      message: "Danh sách size",
      data
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message

    })
  }

};

export const deleteSize = async (req, res) => {
  try {
    const data = await Size.findByIdAndDelete(req.params.id);
    if (!data || data.length === 0) {
      res.status(404).json({
        message: "Delete size thất bại !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Delete size thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
