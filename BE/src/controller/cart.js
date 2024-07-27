import Cart from "../models/cart.js";

export const getMyCarts = async (req, res) => {
  const userId = req.profile._id;
  try {
    const data = await Cart.findOne({ userId })
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "products.variant",
        model: "ProductSize",
      })
      .exec();

    const totalPrice = data?.products.reduce((res, curr) => {
      res += curr.variant.price * curr.quantity;

      return res;
    }, 0);

    res.json({
      ...data?._doc,
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addCart = async (req, res) => {
  try {
    const userId = req.profile._id;
    const { productId, quantity, variantId } = req.body;

    let foundCart = await Cart.findOne({ userId }).exec();

    let response;
    if (foundCart) {
      const foundProduct = foundCart.products.find(
        (it) =>
          it.product.toString() === productId &&
          it.variant.toString() === variantId
      );
      if (foundProduct) {
        foundProduct.quantity += quantity;

        const newProducts = foundCart.products.map((it) =>
          it.product.toString() === foundProduct.product.toString() &&
          it.variant.toString() === foundProduct.product.toString()
            ? foundProduct
            : it
        );
        foundCart.products = newProducts;
      } else {
        foundCart.products.push({
          product: productId,
          quantity,
          variant: variantId,
        });
      }

      response = await foundCart.save();
    } else {
      response = await new Cart({
        products: [
          {
            product: productId,
            quantity,
            variant: variantId,
          },
        ],
        userId,
      }).save();
    }

    res.json({
      data: response,
      message: "Add cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.profile._id;
    const { variantId, quantity } = req.body;
    const cart = await Cart.findOne({ userId }).exec();
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const newProducts = cart.products.map((it) =>
      it.variant.toString() === variantId ? { ...it, quantity } : it
    );
    cart.products = newProducts;
    await cart.save();

    res.json({
      message: "Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const userId = req.profile._id;
    const { variantId } = req.params;

    const cart = await Cart.findOne({ userId }).exec();
    const newProducts = cart.products.filter(
      (it) => it.variant.toString() !== variantId
    );

    cart.products = newProducts;
    await cart.save();

    res.json({
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
