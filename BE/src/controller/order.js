import Order from "../models/order.js";
import Cart from "../models/cart.js";
import product from "../models/product.js";
import querystring from "qs";
import crypto from "crypto";
import dateFormat from "dayjs";
import dotenv from "dotenv";

dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const { productSelectedIds, paymentMethod, ...bodyData } = req.body;
    const userId = req.profile._id;
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "products.product",
        model: "Product",
      })
      .exec();

    const cartProducts = cart.products?.filter((it) =>
      productSelectedIds.includes(it.product._id.toString())
    );
    const products = cartProducts.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalPrice = cartProducts.reduce((total, curr) => {
      total += curr.product.price * curr.quantity;

      return total;
    }, 0);

    for (let item of cartProducts) {
      await product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: { quantity: -item.quantity },
        },
        { new: true }
      );
    }

    const orders = await new Order({
      ...bodyData,
      userId,
      quantity: cartProducts.length,
      totalPrice,
      products,
      paymentMethod,
      status: paymentMethod === "COD" ? "Chờ xác nhận" : "Chờ thanh toán",
    }).save();

    cart.products = cart.products.filter(
      (it) => !productSelectedIds.includes(it.product._id.toString())
    );
    await cart.save();

    // create vnpay payment url
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let paymentUrl = "";

    if (paymentMethod === "VNPAY") {
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

export const getMyOrders = async (req, res) => {
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

export const getAllOrders = async (req, res) => {
  const statusReq = req.query.status;

  try {
    let query = {};

    if (statusReq) {
      query = { status: statusReq };
    }

    const orders = await Order.find(query);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Success",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
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

export const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const orders = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();
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
