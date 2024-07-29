import Comment from "../models/comment";
import product from "../models/product";
import productSize from "../models/productSize";
import user from "../models/user";

/**
 * API lấy ra danh sách bình luận
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllComment = async (req, res) => {
  const { idUser, idProduct, status, page = 1 } = req.body;
  const pageSize = 5;

  try {
    // tạo tiêu chí tìm kiếm
    let filter = {};

    if (idUser) {
      filter.idUser = idUser;
    }

    if (idProduct) {
      filter.idProduct = idProduct;
    }

    if (status !== null && status !== undefined) {
      filter.status = status;
    }

    // tìm kiếm theo tiêu chí
    const total = await Comment.countDocuments(filter);
    const data = await Comment.find(filter)
      .sort({ productName: 1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      message: "Danh sách bình luận",
      data: {
        comments: data,
        total: total,
        size: pageSize,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API lấy ra danh sách bình luận của 1 sản phẩm
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getCommentByIdProduct = async (req, res) => {
  try {
    const data = await Comment.find({
      idProduct: req.body.idProduct,
      status: "1",
    }).sort("-createdAt");
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách bình luận !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách bình luận",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API tạo 1 bình luận cho 1 sản phẩm
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const createComment = async (req, res) => {
  try {
    const data = await Comment.create(req.body);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Bình luận thất bại!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Bình luận thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API cập nhật 1 bình luận cho 1 sản phẩm
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updateComment = async (req, res) => {
  try {
    const { _id, rate, comment } = req.body;

    const data = await Comment.findByIdAndUpdate(
      _id,
      { rate: rate, comment: comment },
      {
        new: true,
      }
    );

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy bình luận để cập nhật!",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Cập nhật bình luận thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API xóa 1 bình luận
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteComment = async (req, res) => {
  const { _id, status } = req.body;

  if (!_id || status === undefined) {
    return res.status(400).json({
      message: "Thiếu thông tin cần thiết để cập nhật!",
    });
  }

  try {
    const data = await Comment.findByIdAndUpdate(
      _id,
      { status }, // Chỉ cập nhật trường status
      { new: true } // Trả về bản ghi đã cập nhật
    );

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy bình luận để cập nhật!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái bình luận thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API xem chi tiết 1 bình luận
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const detailComment = async (req, res) => {
  try {
    const data = await Comment.findById(req.params._id);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bình luận!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy bình luận",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API xem chi tiết 1 bình luận theo user và product size
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const detailByUserAndProductSize = async (req, res) => {
  try {
    const data = await Comment.findOne({
      idUser: req.body.idUser,
      idProductSize: req.body.idProductSize,
    });
    if (!data) {
      return res.status(200).json({
        message: "Không tìm thấy bình luận!",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy bình luận",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API danh sách tài khoản
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const findAllUser = async (req, res) => {
  try {
    const data = await user.find();
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách tài khoản!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy danh sách tài khoản",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API danh sách sản phẩm
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const findAllProduct = async (req, res) => {
  try {
    const data = await product.find();
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách sản phẩm!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy danh sách sản phẩm",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API danh sách sản phẩm
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const findProductSizeById = async (req, res) => {
  try {
    const data = await productSize.findById(req.body._id);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy product size!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy product size",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
