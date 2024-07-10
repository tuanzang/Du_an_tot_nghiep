import Order from "../models/order.js";
import Cart from "../models/cart.js";
import product from "../models/product.js";
import dayjs from "dayjs";

/**
 * API tạo mới hóa đơn
 * @param {*} req
 * @param {*} res
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.profile._id;
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "products.product",
        model: "Product",
      })
      .exec();
    const products = cart.products.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalPrice = cart.products.reduce((total, curr) => {
      total += curr.product.price * curr.quantity;

      return total;
    }, 0);

    for (let item of cart.products) {
      await product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: { quantity: -item.quantity },
        },
        { new: true }
      );
    }

    const orders = await new Order({
      ...req.body,
      code: `HD${dayjs().format("YYYYMMDDHHmmss")}`,
      userId,
      quantity: cart.products.length,
      totalPrice,
      products,
      status: "1",
    }).save();

    await Cart.findOneAndDelete({ userId }).exec();

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * API xem chi tiết đơn hàng
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const detailOrder = async (req, res) => {
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
export const getAllOrders = async (req, res) => {
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
 * API cập nhật trạng thái hóa đơn
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Chuyển trạng thái thất bại",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    ).exec();

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn",
      });
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