import DiscountCode from "../models/DiscountCode.js";
import Order from "../models/order.js";
import productSize from "../models/productSize.js";

/**
 * API xem chi tiết đơn hàng
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const detailBill = async (req, res) => {
  try {
    const orders = await Order.findById(req.params.id);
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Success",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * API danh sách hóa đơn
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllBill = async (req, res) => {
  const { status, code, createAtFrom, createAtTo, page = 1 } = req.body;
  const pageSize = 10;

  try {
    let query = {};

    if (status) {
      query.status = status;
    }

    if (code) {
      query.code = { $regex: code, $options: "i" }; // Tìm kiếm mã hóa đơn với regex, không phân biệt hoa thường, tìm kiếm theo like
    }

    if (createAtFrom || createAtTo) {
      query.createdAt = {};
      if (createAtFrom) {
        query.createdAt.$gte = new Date(createAtFrom);
      }
      if (createAtTo) {
        query.createdAt.$lte = new Date(createAtTo);
      }
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Order.countDocuments(query);

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy đơn hàng!",
        data: [],
        total: 0,
      });
    }

    return res.status(200).json({
      message: "Success",
      data: orders,
      total: total,
      size: pageSize,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * API danh sách hóa đơn
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllBillByIdUser = async (req, res) => {
  const { status, userId, page = 1 } = req.body;
  const pageSize = 10;

  try {
    let query = {};

    if (status) {
      query.status = status;
    }

    if (userId) {
      query.userId = userId;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Order.countDocuments(query);

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy đơn hàng!",
        data: [],
        total: 0,
      });
    }

    return res.status(200).json({
      message: "Success",
      data: orders,
      total: total,
      size: pageSize,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * API cập nhật trạng thái hóa đơn
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updateStatusBill = async (req, res) => {
  try {
    const { id, status, statusShip } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Chuyển trạng thái thất bại",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status: status, statusShip: statusShip } },
      { new: true }
    ).exec();

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn",
      });
    }

    // hủy đơn hàng
    if (status === '0' && updatedOrder.discountCode) {
      await DiscountCode.findOneAndUpdate({ code: updatedOrder.discountCode }, {  $inc: { usedCount: -1 }})
    }

    return res.status(200).json({
      message: "Success",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * API giảm số lượng product size
 * @param req
 * @param res
 * @returns
 */
export const decreaseProductSize = async (req, res) => {
  try {
    const { listProductSize } = req.body;

    if (!Array.isArray(listProductSize) || listProductSize.length === 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    const updatedProducts = [];

    for (const product of listProductSize) {
      const { variantId, quantity } = product;

      if (!variantId || quantity === undefined) {
        return res.status(400).json({
          message: "Thông tin sản phẩm không đầy đủ",
        });
      }

      const currentProduct = await productSize
        .findById({ _id: variantId })
        .exec();

      if (!currentProduct) {
        return res.status(404).json({
          message: `Không tìm thấy sản phẩm với ID: ${variantId}`,
        });
      }

      if (currentProduct.quantity < quantity) {
        return res.status(400).json({
          message: `Số lượng của sản phẩm không đủ`,
        });
      }

      currentProduct.quantity -= quantity;

      // Cập nhật trạng thái nếu số lượng bằng 0
      if (currentProduct.quantity === 0) {
        currentProduct.status = false;
      }

      await currentProduct.save();
      updatedProducts.push(currentProduct);
    }

    return res.status(200).json({
      message: "Cập nhật thành công",
      data: updatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * API tăng số lượng product size
 * @param req
 * @param res
 * @returns
 */
export const increaseProductSize = async (req, res) => {
  try {
    const { listProductSize } = req.body;

    if (!Array.isArray(listProductSize) || listProductSize.length === 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    const updatedProducts = [];

    for (const product of listProductSize) {
      const { variantId, quantity } = product;

      if (!variantId || quantity === undefined) {
        return res.status(400).json({
          message: "Thông tin sản phẩm không đầy đủ",
        });
      }

      const currentProduct = await productSize
        .findById({ _id: variantId })
        .exec();

      if (!currentProduct) {
        return res.status(404).json({
          message: `Không tìm thấy sản phẩm với ID: ${variantId}`,
        });
      }

      currentProduct.quantity += quantity;

      // Cập nhật trạng thái nếu số lượng > 0
      if (currentProduct.quantity > 0) {
        currentProduct.status = true;
      }

      await currentProduct.save();
      updatedProducts.push(currentProduct);
    }

    return res.status(200).json({
      message: "Cập nhật thành công",
      data: updatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
