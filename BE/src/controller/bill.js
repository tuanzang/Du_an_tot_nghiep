import Order from "../models/order.js";
import optionCategorios from "../models/option.js";
import productSize from "../models/productSize.js";
import sendMail from "../utils/sendMail.js";
import { confirmOrderMailContent } from "../constants/const.js";
import dayjs from "dayjs"

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
        size: pageSize,
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

    const updatedOrder = await Order
      .findByIdAndUpdate(
        id,
        { $set: { status: status, statusShip: statusShip } },
        { new: true }
      )
      .populate('userId')
      .populate({
        path: 'products.variantId',
        model: 'ProductSize'
      })
      .populate({
        path: 'products.optionId',
        model: 'option'
      })
      .exec();

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy hóa đơn",
      });
    }

    // xác nhận đơn hàng
    if (status === '2') {
      await sendMail({
        mailTo: updatedOrder?.userId?.email,
        title: `Xác Nhận Đơn Hàng #${updatedOrder.code} - Cảm ơn bạn đã mua sắm tại FBEE`,
        content: confirmOrderMailContent({
          name: updatedOrder?.customerName,
          orderId: updatedOrder?.code,
          orderDate: dayjs(updatedOrder?.createdAt).format('DD/MM/YYYY HH:mm:ss'),
          totalPrice: updatedOrder?.totalPrice,
          products: updatedOrder?.products
        })
      })
      // return res.json(123);
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      data: updatedOrder,
    });
  } catch (error) {
    // console.log(error)
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * API giảm số lượng product size và Option
 * @param req
 * @param res
 * @returns
 */
export const decreaseProductSizeAndOption = async (req, res) => {
  try {
    const { listProductSize } = req.body;

    if (!Array.isArray(listProductSize) || listProductSize.length === 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    for (const product of listProductSize) {
      const { variantId, quantity, optionId } = product;

      if (
        quantity === undefined ||
        quantity === null ||
        isNaN(quantity) ||
        quantity <= -1
      ) {
        return res.status(400).json({
          message: "Thông tin sản phẩm không đầy đủ",
        });
      }

      // kiểm tra nếu varianId xác định thì valdiate
      if (variantId) {
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

        await productSize.findByIdAndUpdate(
          { _id: variantId },
          {
            $inc: { quantity: -quantity }, // Giảm số lượng
            $set: {
              // Cập nhật trạng thái nếu cần
              status:
                currentProduct.quantity - quantity === 0
                  ? 0
                  : currentProduct.status,
            },
          }
        );
      }

      // kiểm tra nếu optionId xác định thì valdiate
      if (optionId) {
        const currentOption = await optionCategorios
          .findById({ _id: optionId })
          .exec();

        if (!currentOption) {
          return res.status(404).json({
            message: `Không tìm thấy phụ kiện với ID: ${optionId}`,
          });
        }

        if (currentOption.quantity < quantity) {
          return res.status(400).json({
            message: `Số lượng của phụ kiện không đủ`,
          });
        }

        await optionCategorios.findByIdAndUpdate(
          { _id: optionId },
          {
            $inc: { quantity: -quantity }, // Giảm số lượng
            $set: {
              // Cập nhật trạng thái nếu cần
              status:
                currentOption.quantity - quantity === 0
                  ? 0
                  : currentOption.status,
            },
          }
        );
      }
    }

    return res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

/**
 * API tăng số lượng product size
 * @param req
 * @param res
 * @returns
 */
export const increaseProductSizeAndOption = async (req, res) => {
  const { listProductSize } = req.body;

  if (!Array.isArray(listProductSize) || listProductSize.length === 0) {
    return res.status(400).json({
      message: "Danh sách sản phẩm không hợp lệ",
    });
  }
  try {
    for (const product of listProductSize) {
      const { variantId, quantity, optionId } = product;

      if (
        quantity === undefined ||
        quantity === null ||
        isNaN(quantity) ||
        quantity <= -1
      ) {
        return res.status(400).json({
          message: "Thông tin sản phẩm không đầy đủ",
        });
      }

      // kiểm tra nếu varianId xác định thì valdiate
      if (variantId) {
        const currentProduct = await productSize
          .findById({ _id: variantId })
          .exec();

        if (!currentProduct) {
          return res.status(404).json({
            message: `Không tìm thấy sản phẩm với ID: ${variantId}`,
          });
        }

        await productSize.findByIdAndUpdate(
          { _id: variantId },
          {
            $inc: { quantity: quantity }, // tăng số lượng
            $set: {
              // Cập nhật trạng thái nếu cần
              status:
                currentProduct.quantity + quantity > 0
                  ? 1
                  : currentProduct.status,
            },
          }
        );
      }

      // kiểm tra nếu optionId xác định thì valdiate
      if (optionId) {
        const currentOption = await optionCategorios
          .findById({ _id: optionId })
          .exec();

        if (!currentOption) {
          return res.status(404).json({
            message: `Không tìm thấy phụ kiện với ID: ${optionId}`,
          });
        }

        await optionCategorios.findByIdAndUpdate(
          { _id: optionId },
          {
            $inc: { quantity: quantity }, // tăng số lượng
            $set: {
              // Cập nhật trạng thái nếu cần
              status:
                currentOption.quantity + quantity > 0
                  ? 1
                  : currentOption.status,
            },
          }
        );
      }
    }

    return res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
