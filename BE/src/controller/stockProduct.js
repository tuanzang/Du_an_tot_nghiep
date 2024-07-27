import Order from "../models/order.js";
import Product from "../models/product.js";

/**
 * API lấy danh sách sản phẩm chưa được order
 * @param {*} req
 * @param {*} res
 */
export const getStockProducts = async (req, res) => {
  try {
    const { limit = 3 } = req.query; // Giới hạn số lượng sản phẩm trả về

    // Lấy danh sách các sản phẩm đã được order
    const orderedProducts = await Order.aggregate([
      { $unwind: "$products" }, // Tách mảng products trong mỗi order thành các document riêng biệt
      {
        $group: {
          _id: "$products.name",
        },
      },
    ]);

    // Tạo một danh sách tên các sản phẩm đã được order
    const orderedProductNames = orderedProducts.map(product => product._id);

    // Lấy danh sách các sản phẩm chưa được order
    const unorderedProducts = await Product.find({
      name: { $nin: orderedProductNames }
    }).select("name price description image stock categoryId").limit(parseInt(limit, 10));

    if (!unorderedProducts || unorderedProducts.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy sản phẩm chưa được order!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách sản phẩm tồn kho",
      data: unorderedProducts,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};
