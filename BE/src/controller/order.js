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
    const products = cart.products.map((it) => ({
      name: it.product.name,
      price: it.product.price,
      quantity: it.quantity,
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
