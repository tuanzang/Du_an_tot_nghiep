import Order from "../models/order.js";
import Cart from "../models/cart.js";

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
      image: item.product.image,
    }));

    const totalPrice = cart.products.reduce((total, curr) => {
      total += curr.product.price * curr.quantity;

      return total;
    }, 0);

    const orders = await new Order({
      ...req.body,
      userId,
      totalPrice,
      products,
    }).save();

    await Cart.findOneAndDelete({ userId }).exec();

    res.json(orders);
  } catch (error) {
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

}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
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
}

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
}

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
}
