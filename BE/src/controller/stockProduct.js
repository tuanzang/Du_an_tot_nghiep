import { query } from "express";
import Product from "../models/product.js";

/**
 * API lấy danh sách sản phẩm tồn kho
 * @param {*} req
 * @param {*} res
 */
export const getStockProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Giới hạn số lượng sản phẩm trả về

    // Truy vấn danh sách sản phẩm tồn kho từ cơ sở dữ liệu
    const stockProducts = await Product.find()
      .sort({ stock: -1 }) // Sắp xếp theo số lượng tồn kho từ cao đến thấp
      .limit(parseInt(limit, 10)) // Giới hạn số lượng sản phẩm trả về
      .select("name price description image categoryId stock"); // Chỉ lấy các trường cần thiết

    if (!stockProducts || stockProducts.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy sản phẩm nào!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách sản phẩm tồn kho",
      data: stockProducts,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};
