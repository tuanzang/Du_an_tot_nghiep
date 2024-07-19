import { query } from "express";
import Order from "../models/order.js";
    import Product from "../models/product.js";

/**
 * API lấy danh sách sản phẩm được order nhiều nhất
 * @param {*} req
 * @param {*} res
 */
export const getTopOrderedProducts = async (req, res) => {
  try {

    // Lấy params
    const statusReq = req.query.status;
    if(statusReq){
      query.status = statusReq
    }
    const { limit = 10 } = req.query; // Giới hạn số lượng sản phẩm trả về, mặc định là 10

    // Aggregation pipeline để tính tổng số lượng của mỗi sản phẩm đã được order
    const topProducts = await Order.aggregate([
      { $unwind: "$products" }, // Tách mảng products trong mỗi order thành các document riêng biệt
      {
        $group: {
          _id: "$products.name",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "name",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      { $sort: { totalQuantity: -1 } }, // Sắp xếp theo tổng số lượng từ cao đến thấp
      { $limit: parseInt(limit, 10) }, // Giới hạn số lượng sản phẩm trả về
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalQuantity: 1,
          productDetails: {
            price: 1,
            description: 1,
            image: 1,
            categoryId: 1,
          },
        },
      },
    ]);

    if (!topProducts || topProducts.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm nào!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách sản phẩm được order nhiều nhất",
      data: topProducts,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};
