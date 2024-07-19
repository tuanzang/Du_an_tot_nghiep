import { sanitizeFilter } from "mongoose";
import product from "../models/product.js";
import productSize from "../models/productSize.js";

export const getAllProduct = async (req, res) => {
  try {
    const data = await product.find();
    if (!data || data.length === 0) {
     return res.status(404).json({
        message: "Không tìm thấy sản phẩm nào!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách sản phẩm",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  const { query } = req.query;
  
  try {
    const regex = new RegExp(query, 'i'); // Tạo regex để tìm kiếm không phân biệt hoa thường
    const data = await product.find({ $or: [{ name: regex }, { description: regex }] });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${query}"!`,
        data: [],
      });
    }

    return res.status(200).json({
      message: `Kết quả tìm kiếm cho từ khóa "${query}"`,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getDetailProduct = async (req, res) => {
  try {
    const data = await product.findById(req.params.id);
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy sản phẩm",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    // cái ni mình nói thêm là chưa gì mà create phải có validate chứ lỡ ko nhập thì bị lỗi đó
    const data = await product.create(req.body);
    if (!data || data.length === 0) {
      res.status(404).json({
        message: "Không thêm được sản phẩm !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Thêm sản phẩm thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createProductSizes = async (req, res) => {
  try {
    const requestData = req.body; // Lấy danh sách productSize từ req.body

    // Kiểm tra nếu không có dữ liệu hoặc dữ liệu trống
    if (!requestData || requestData.length === 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ hoặc không có dữ liệu để tạo.",
        data: [],
      });
    }

    // Tạo mảng promises để lưu kết quả tạo từng productSize
    const createPromises = requestData.map(async (productSizeData) => {
      return await productSize.create(productSizeData); // Sử dụng productsSize.create() để tạo productSize
    });

    // Chạy tất cả các promises và chờ cho tất cả các lời hứa được giải quyết
    const createdProductSizes = await Promise.all(createPromises);

    // Kiểm tra kết quả tạo productSize
    if (!createdProductSizes || createdProductSizes.length === 0) {
      return res.status(404).json({
        message: "Tạo danh sách sản phẩm thất bại!",
        data: [],
      });
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      message: "Tạo danh sách sản phẩm thành công",
      data: createdProductSizes,
    });
  } catch (error) {
    // Xử lý lỗi nếu có
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const data = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data || data.length === 0) {
      res.status(404).json({
        message: "Update thất bại !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Update thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const data = await product.findByIdAndDelete(req.params.id);
    if (!data || data.length === 0) {
      res.status(404).json({
        message: "Xóa sản phẩm thất bại!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const filterProductsByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    // Xây dựng bộ lọc giá
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = minPrice;
    if (maxPrice) priceFilter.$lte = maxPrice;

    // Tìm kiếm sản phẩm với bộ lọc giá
    const data = await product.find({ price: priceFilter });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: `Không tìm thấy sản phẩm nào trong khoảng giá từ ${minPrice} đến ${maxPrice}!`,
        data: [],
      });
    }

    return res.status(200).json({
      message: `Danh sách sản phẩm trong khoảng giá từ ${minPrice} đến ${maxPrice}`,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

