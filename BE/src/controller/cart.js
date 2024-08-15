import Cart from "../models/cart.js";
import ProductVariant from "../models/productSize.js";
import Option from "../models/option.js";
import Product from "../models/product.js"

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
      .populate({
        path: "products.option",
        model: "option",
      })
      .exec();

    if (!data) {
      return res.json({});
    }

    let newProducts = data.products.filter((it) => it.product.status === 1);
    data.products = newProducts;
    const newCart = await data.save();

    // check product option status
    const tempProducts = [];
    for await (let product of newProducts) {
      const findProduct = await Product.findById(product.product._id);
      // console.log(findProduct.options);
      if (product.option && !findProduct.options.includes(product.option._id.toJSON())) {
        tempProducts.push({
          ...product.toJSON(),
          option: {
            ...product.option.toJSON(),
            status: 0
          }
        })
      } else {
        tempProducts.push(product);
      }
    }

    const totalPrice = newCart?.products.reduce((res, curr) => {
      res += curr.variant.price * curr.quantity;

      return res;
    }, 0);

    return res.json({
      ...newCart?._doc,
      products: tempProducts,
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
    const { productId, quantity, variantId, option } = req.body;

    let foundCart = await Cart.findOne({ userId }).exec();

    let response;
    if (foundCart) {
      const foundProduct = foundCart.products.find((it) => {
        return (
          it.product.toString() === productId &&
          it.variant.toString() === variantId &&
          it?.option?.toString() === option
        );
      });

      // check variant quantity
      const allProductVariantQnt = foundCart.products
        .filter((it) => it.variant.toString() === variantId)
        .reduce((total, curr) => {
          return (total += curr.quantity);
        }, 0);

      const productVariant = await ProductVariant.findById(variantId);
      if (allProductVariantQnt + quantity > productVariant.quantity) {
        return res.status(400).json({
          message: "Số lượng sản phẩm vượt quá cho phép",
        });
      }

      // check option quantity
      if (option) {
        const allProductVariantQnt = foundCart.products
          .filter((it) => it.option?.toString() === option)
          .reduce((total, curr) => {
            return (total += curr.quantity);
          }, 0);

        const findOption = await Option.findById(option);
        if (allProductVariantQnt + quantity > findOption.quantity) {
          return res.status(400).json({
            message: "Số lượng option vượt quá cho phép",
          });
        }
      }

      if (foundProduct) {
        foundProduct.quantity += quantity;
        const newProducts = foundCart.products.map((it) =>
          it.product.toString() === foundProduct.product.toString() &&
          it.variant.toString() === foundProduct.variant.toString() &&
          it?.option?.toString() === foundProduct?.option?.toString()
            ? foundProduct
            : it
        );
        foundCart.products = newProducts;
      } else {
        foundCart.products.push({
          product: productId,
          quantity,
          variant: variantId,
          option,
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
            option,
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
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.profile._id;
    const { variantId, quantity, option } = req.body;
    const cart = await Cart.findOne({ userId }).exec();
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // check variant quantity
    const allProductVariantQnt = cart.products
      .filter((it) => it.variant.toString() === variantId)
      .filter((it) => it?.option?.toString() !== option)
      .reduce((total, curr) => {
        return (total += curr.quantity);
      }, 0);

    const productVariant = await ProductVariant.findById(variantId);
    if (allProductVariantQnt + quantity > productVariant.quantity) {
      return res.status(400).json({
        message: "Số lượng sản phẩm vượt quá cho phép",
      });
    }

    // check option quantity
    if (option) {
      const allProductOptionQnt = cart.products
        .filter((it) => it?.option?.toString() === option)
        .filter((it) => it?.variant?.toString() !== variantId)
        .reduce((total, curr) => {
          return (total += curr.quantity);
        }, 0);

      // console.log(allProductOptionQnt);

      const findOption = await Option.findById(option);
      if (allProductOptionQnt + quantity > findOption.quantity) {
        return res.status(400).json({
          message: "Số lượng option vượt quá cho phép",
        });
      }
    }

    const newProducts = cart.products.map((it) =>
      it.variant.toString() === variantId && it.option?.toString() === option
        ? { ...it, quantity }
        : it
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
    const { variantId, option } = req.body;

    const cart = await Cart.findOne({ userId }).exec();
    const newProducts = cart.products.filter((it) => {
      const status =
        it.variant.toString() === variantId &&
        it?.option?.toString() === option;

      return !status;
    });

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
