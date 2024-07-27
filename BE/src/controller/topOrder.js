import { query } from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";

/**
 * API lấy danh sách sản phẩm được order nhiều nhất trong một khoảng thời gian
 * @param {*} req
 * @param {*} res
 */
export const getTopOrderedProducts = async (req, res) => {
  try {
    const { startDate, endDate, nowDate, limit = 10 } = req.query; // Thêm nowDate vào query

    // Kiểm tra nếu thiếu tham số thời gian
    if (!startDate && !nowDate) {
      return res.status(400).json({
        message: "Vui lòng cung cấp startDate và (endDate hoặc nowDate)",
      });
    }

    // Chuyển đổi startDate và endDate sang đối tượng Date
    const dateStart = startDate ? new Date(startDate) : null;
    const currentDate = nowDate ? new Date(nowDate) : new Date(); // Thiết lập nowDate là ngày hiện tại nếu không được cung cấp
    const dateEnd = endDate ? new Date(endDate) : currentDate;

    // Aggregation pipeline để tính tổng số lượng của mỗi sản phẩm đã được order trong khoảng thời gian
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            ...(dateStart && { $gte: dateStart }),
            $lte: dateEnd,
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