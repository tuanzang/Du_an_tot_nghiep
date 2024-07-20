import { query } from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Category from "../models/category.js";

/**
 * API lấy danh sách sản phẩm được order nhiều nhất trong một khoảng thời gian
 * @param {*} req
 * @param {*} res
 */
export const getTopOrderedProducts = async (req, res) => {
  try {
    let { startDate, endDate, limit = 10 } = req.query; // Thêm startDate và endDate vào query

    // Nếu không truyền endDate, sử dụng ngày hiện tại
    if (!endDate) {
      const today = new Date();
      endDate = today.toISOString().split('T')[0];
    }

    // Nếu không truyền startDate, sử dụng ngày của endDate
    if (!startDate) {
      startDate = endDate;
    }

    // Chuyển đổi startDate và endDate sang đối tượng Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Aggregation pipeline để tính tổng số lượng của mỗi sản phẩm đã được order trong khoảng thời gian
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
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
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
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
          },
          categoryName: "$categoryDetails.name"
        },
      },
    ]);

    if (!topProducts || topProducts.length === 0) {
      return res.status(200).json({
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
