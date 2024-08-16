import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Discount from "../models/DiscountCode.js";
import querystring from "qs";
import crypto from "crypto";
import dateFormat from "dayjs";
import dotenv from "dotenv";
import dayjs from "dayjs";
import DiscountCode from "../models/DiscountCode.js";
import convertHtmlToPdf from "../utils/pdf.js";
import uploadFileToCloudinary from "../utils/cloudinary.js";
import { CERTIFICATE_HTML_STR, completedOrderMailContent } from "../constants/const.js";
import sendMail from "../utils/sendMail.js";

dotenv.config();

/**
 * API tạo mới hóa đơn
 * @param {*} req
 * @param {*} res
 */
export const createOrder = async (req, res) => {
  try {
    const { productSelectedIds, ...bodyData } = req.body;
    const { customerName, phone, address, paymentMethod, discountCode } =
      bodyData;

    // Xác thực các trường dữ liệu
    if (!customerName) {
      return res.status(200).json({
        message: "Trường họ và tên không được để trống",
        success: false,
      });
    }

    if (!phone) {
      return res.status(200).json({
        message: "Trường số điện thoại không được để trống",
        success: false,
      });
    }

    if (!address) {
      return res.status(200).json({
        message: "Trường địa chỉ không được để trống",
        success: false,
      });
    }

    if (!paymentMethod) {
      return res.status(200).json({
        message: "Loại thanh toán không được để trống",
        success: false,
      });
    }

    if (paymentMethod !== "COD" && paymentMethod !== "VNPAY") {
      return res.status(200).json({
        message: "Loại thanh toán phải là COD hoặc VNPAY",
        success: false,
      });
    }

    // Xác thực không chứa ký tự đặc biệt cho name và address
    if (customerName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(customerName)) {
      return res.status(200).json({
        message: "Họ và tên không được chứa ký tự đặc biệt.",
        success: false,
      });
    }

    if (address && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(address)) {
      return res.status(200).json({
        message: "Địa chỉ không được chứa ký tự đặc biệt.",
        success: false,
      });
    }

    // Xác thực số điện thoại
    const phonePattern = /^(?:\+84|0)(\d{9})$/;
    if (!phonePattern.test(phone)) {
      return res.status(200).json({
        message:
          "Số điện thoại phải là dịnh dạng +84 hoặc số 0 đầu tiên và gồm 10 chữ số",
        success: false,
      });
    }

    const userId = req.profile._id;
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "products.variant",
        model: "ProductSize",
      })
      .populate({
        path: "products.option",
        model: "option",
      })
      .exec();

    const cartProducts = cart.products?.filter((it) =>
      productSelectedIds.includes(it.variant._id.toString())
    );

    const products = cartProducts.map((item) => ({
      name: item.product.name,
      price: item.variant.price,
      quantity: item.quantity,
      image: item.product.image[0],
      size: item.variant.sizeName,
      variantId: item.variant._id,
      optionName: item?.option?.name,
      optionPrice: item?.option?.price,

      optionId: item?.option?._id,
    }));

    let totalPrice =
      cartProducts.reduce((total, curr) => {
        let priceTotal = curr.variant.price * curr.quantity;

        if (curr.option) {
          priceTotal += curr.option.price * curr.quantity;
        }

        return (total += priceTotal);
      }, 0);
      
    const totalPriceWithDiscount = totalPrice - bodyData.discouVoucher;

    if (totalPriceWithDiscount < 0) {
      totalPrice = 0;
    }

    totalPrice += bodyData.shippingCost;

    // add user id to voucher
    await Discount.findOneAndUpdate(
      { code: discountCode },
      { $push: { userIds: userId }, $inc: { usedCount: 1 } }
    );

    const orders = await new Order({
      ...req.body,
      code: `HD${dayjs().format("YYYYMMDDHHmmss")}`,
      userId,
      quantity: cartProducts.length,
      totalPrice,
      quantity: cart.products.length,
      products,
      status: "1",
      discountCode
    }).save();

    cart.products = cart.products.filter(
      (it) => !productSelectedIds.includes(it.variant._id.toString())
    );
    await cart.save();

    // create vnpay payment url
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let paymentUrl = "";

    if (bodyData.paymentMethod === "VNPAY") {
      paymentUrl = createPaymentUrl(
        ipAddr,
        `FBEE_${orders._id}`,
        `Thanh toán đơn hàng ${orders._id}`,
        totalPrice
      );
    }

    res.json({
      paymentUrl,
      data: orders,
    });
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

const getOrdersByDate = async (dateStart, dateEnd, status) => {};
export const getTotalOrdersByDate = async (req, res) => {
  const { dateStart, dateEnd, status } = req.query;
  try {
    const totalOrders = await getOrdersByDate(dateStart, dateEnd, status);
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  const { dateStart, dateEnd } = req.query;
  const statusReq = req.query.status;
  const dateNowReq = req.query.dateNow;
  const pageSize = 10;

  try {
    let query = {};

    if (statusReq) {
      query.status = statusReq;
    }

    if (status) {
      query.status = status;
    }

    if (code) {
      query.code = { $regex: code, $options: "i" }; // Tìm kiếm mã hóa đơn với regex, không phân biệt hoa thường
    }

    if (dateNowReq) {
      const dateNow = new Date(dateNowReq);
      const startOfDay = new Date(dateNow.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(dateNow.setUTCHours(23, 59, 59, 999));

      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
    if (dateStart || dateEnd) {
      query.createdAt = {};
      if (dateStart) {
        query.createdAt.$gte = new Date(dateStart);
      }
      if (dateEnd) {
        query.createdAt.$lte = new Date(dateEnd);
      }
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

    if (!orders || orders?.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy đơn hàng!",
        data: [],
        total: 0,
      });
    }
    console.log(orders);
    return res.status(200).json({
      message: "Success",
      data: orders,
      total: total,
      size: pageSize,
      
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const orders = await Order.findByIdAndDelete(id).exec();
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

    const updatedOrder = await Order
    .findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    )
    .populate('userId')
    .exec();

    // hủy đơn hàng
    if (status === '0' && updatedOrder.discountCode) {
      await DiscountCode.findOneAndUpdate({ code: updatedOrder.discountCode }, {  $inc: { usedCount: -1 }})
    }

    // hoàn thành đơn hàng
    if (status === '6') {
      // convert html to pdf
      const filePath = await convertHtmlToPdf(CERTIFICATE_HTML_STR)

      // upload file to cloud
      const fileUploaded = await uploadFileToCloudinary(filePath);

      // send mail
      await sendMail({
        mailTo: updatedOrder?.userId?.email,
        title: 'Cảm Ơn Bạn Đã Mua Sắm Tại FBEE',
        content: completedOrderMailContent({ customerName: updatedOrder?.customerName }),
        attachmentFile: fileUploaded.secure_url
      })
    }

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
const createPaymentUrl = (ipAddr, orderId, orderInfo, amount) => {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_SECRET_KEY;
  let vnpUrl = process.env.VNPAY_VNP_URL;
  const returnUrl = process.env.VNPAY_RETURN_URL;

  const date = new Date();

  const createDate = dateFormat(date).format("YYYYMMDDHHmmss");
  const expiredDate = dateFormat(date).add(10, "m").format("YYYYMMDDHHmmss");

  const currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  vnp_Params["vnp_ExpireDate"] = expiredDate;

  vnp_Params = Object.entries(vnp_Params)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((result, item) => {
      result = {
        ...result,
        [item[0]]: encodeURIComponent(item[1].toString().replace(/ /g, "+")),
      };

      return result;
    }, {});

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

export const getTotalPriceByDay = async (req, res) => {
  const { dateNow } = req.query;

  try {
    const date = new Date(dateNow);
    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "7",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );
    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceRefundByDay = async (req, res) => {
  const { dateNow } = req.query;

  try {
    const date = new Date(dateNow);
    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "8",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );
    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceCancelByDay = async (req, res) => {
  const { dateNow } = req.query;

  try {
    const date = new Date(dateNow);
    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "0",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );
    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getTotalPriceByWeek = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "7",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceRefundByWeek = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "8",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceCancelByWeek = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "0",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getTotalPriceByMonth = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "7",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceRefundByMonth = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "8",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceCancelByMonth = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "0",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getTotalPriceByYear = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "7",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceRefundByYear = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "8",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceCancelByYear = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd),
      },
      status: "0",
    });

    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getTotalPriceByCustomDay = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  // Kiểm tra xem có các tham số ngày hợp lệ không
  if (!dateStart || !dateEnd) {
    return res.status(400).json({
      message: "Thiếu tham số ngày bắt đầu hoặc ngày kết thúc",
      providedParams: { dateStart, dateEnd }, // Thêm thông tin tham số đã gửi để debug
    });
  }

  // Kiểm tra định dạng của ngày có hợp lệ không
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      message: "Ngày không hợp lệ",
      providedParams: { dateStart, dateEnd }, // Thêm thông tin tham số đã gửi để debug
    });
  }

  try {
    // Tìm các đơn hàng trong khoảng thời gian
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "7",
    });

    // Tính tổng giá trị của các đơn hàng
    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    console.error(error); // In lỗi ra console để dễ dàng kiểm tra
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceRefundByCustomDay = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  // Kiểm tra xem có các tham số ngày hợp lệ không
  if (!dateStart || !dateEnd) {
    return res.status(400).json({
      message: "Thiếu tham số ngày bắt đầu hoặc ngày kết thúc",
      providedParams: { dateStart, dateEnd }, // Thêm thông tin tham số đã gửi để debug
    });
  }

  // Kiểm tra định dạng của ngày có hợp lệ không
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      message: "Ngày không hợp lệ",
      providedParams: { dateStart, dateEnd }, // Thêm thông tin tham số đã gửi để debug
    });
  }

  try {
    // Tìm các đơn hàng trong khoảng thời gian
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "8",
    });

    // Tính tổng giá trị của các đơn hàng
    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    console.error(error); // In lỗi ra console để dễ dàng kiểm tra
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getPriceCancelByCustomDay = async (req, res) => {
  const { dateStart, dateEnd } = req.query;

  // Kiểm tra xem có các tham số ngày hợp lệ không
  if (!dateStart || !dateEnd) {
    return res.status(400).json({
      message: "Thiếu tham số ngày bắt đầu hoặc ngày kết thúc",
      providedParams: { dateStart, dateEnd }, // Thêm thông tin tham số đã gửi để debug
    });
  }

  // Kiểm tra định dạng của ngày có hợp lệ không
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      message: "Ngày không hợp lệ",
      providedParams: { dateStart, dateEnd }, // Thêm thông tin tham số đã gửi để debug
    });
  }

  try {
    // Tìm các đơn hàng trong khoảng thời gian
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "0",
    });

    // Tính tổng giá trị của các đơn hàng
    const totalPrice = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return res.status(200).json({
      message: "Success",
      totalPrice,
    });
  } catch (error) {
    console.error(error); // In lỗi ra console để dễ dàng kiểm tra
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
