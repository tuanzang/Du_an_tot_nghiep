import { sanitizeFilter } from "mongoose";
import product from "../models/product.js";
import productSize from "../models/productSize.js";
import size from "../models/size.js";
import category from "../models/category.js";

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
    const regex = new RegExp(query, "i"); // Tạo regex để tìm kiếm không phân biệt hoa thường
    const data = await product.find({
      $or: [{ name: regex }, { description: regex }],
    });

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
    const productId = req.params.productId;
    const requestData = req.body; // Lấy danh sách productSize từ req.body

    const transformData = Object.keys(requestData);

    const body = transformData.reduce((total, curr) => {
      if (curr.startsWith("price")) {
        const [_, idSize] = curr.split("-");
        const isExists = total.find((it) => it.idSize === idSize);

        const quantity = requestData[`quantity-${idSize}`];
        const price = requestData[`price-${idSize}`];

        if (!isExists) {
          total.push({
            idProduct: productId,
            idSize,
            quantity,
            price,
          });
        }

        return total;
      }

      return total;
    }, []);

    let transformBody = [];

    for await (const item of body) {
      const sizeData = await size.findById(item.idSize).exec();

      transformBody.push({
        ...item,
        sizeName: sizeData.name,
      });
    }

    const createdProductSizes = await productSize.insertMany(transformBody);

    // // Kiểm tra nếu không có dữ liệu hoặc dữ liệu trống
    // if (!requestData || requestData.length === 0) {
    //   return res.status(400).json({
    //     message: "Dữ liệu không hợp lệ hoặc không có dữ liệu để tạo.",
    //     data: [],
    //   });
    // }

    // // Tạo mảng promises để lấy tên kích cỡ và tạo từng productSize
    // const createPromises = requestData.map(async (productSizeData) => {
    //   // Tìm size để lấy tên
    //   const Size = await size.findById(productSizeData.idSize).exec();

    //   if (!Size) {
    //     throw new Error(`Kích cỡ với id ${productSizeData.idSize} không tồn tại.`);
    //   }

    //   // Cập nhật dữ liệu để bao gồm tên kích cỡ
    //   const productSizeWithSizeName = {
    //     ...productSizeData,
    //     sizeName: Size.name, // Thêm tên kích cỡ vào dữ liệu
    //   };

    //   // Tạo productSize mới với tên kích cỡ
    //   return await productSize.create(productSizeWithSizeName);
    // });

    // // Chạy tất cả các promises và chờ cho tất cả các lời hứa được giải quyết
    // const createdProductSizes = await Promise.all(createPromises);

    // // Kiểm tra kết quả tạo productSize
    // if (!createdProductSizes || createdProductSizes.length === 0) {
    //   return res.status(404).json({
    //     message: "Tạo danh sách sản phẩm thất bại!",
    //     data: [],
    //   });
    // }

    // Trả về kết quả thành công
    return res.status(200).json({
      message: "Tạo danh sách sản phẩm thành công",
      data: createdProductSizes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductSizesByProductId = async (req, res) => {
  try {
    // Tìm tất cả kích cỡ sản phẩm trong CSDL dựa trên idProduct
    const data = await productSize.find({ idProduct: req.params.idProduct });

    // Kiểm tra nếu không tìm thấy sản phẩm kích cỡ
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy kích cỡ sản phẩm.",
        data: [],
      });
    }

    // Trả về danh sách chi tiết kích cỡ sản phẩm
    return res.status(200).json({
      message: "Lấy danh sách kích cỡ sản phẩm thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data || data.length === 0) {
      res.status(404).json({
        message: "Update thất bại !",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Update thành công",
      data: data,
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
      return res.status(200).json({
        message: `Không có sản phẩm nào trong khoảng giá từ ${minPrice} đến ${maxPrice}!`,
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

export const updateProductSizes = async (req, res) => {
  try {
    const requestData = req.body; // Lấy danh sách productSize từ req.body

    // Kiểm tra nếu không có dữ liệu hoặc dữ liệu trống
    if (!requestData || requestData.length === 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ hoặc không có dữ liệu để cập nhật.",
        data: [],
      });
    }

    // Tạo mảng promises để cập nhật từng productSize
    const updatePromises = requestData.map(async (productSizeData) => {
      const { id, quantity } = productSizeData;

      // Tìm kích cỡ dựa vào idSize để lấy tên kích cỡ
      const Size = await size.findById(productSizeData.idSize).exec();

      if (!Size) {
        throw new Error(
          `Kích cỡ với id ${productSizeData.idSize} không tồn tại.`
        );
      }

      // Cập nhật productSize
      return await productSize.findByIdAndUpdate(
        id,
        {
          quantity,
          // sizeName: Size.name // Cập nhật tên kích cỡ
        },
        { new: true, runValidators: true }
      );
    });

    // Chạy tất cả các promises và chờ cho tất cả các lời hứa được giải quyết
    const updatedProductSizes = await Promise.all(updatePromises);

    // Kiểm tra kết quả cập nhật
    if (!updatedProductSizes || updatedProductSizes.length === 0) {
      return res.status(404).json({
        message: "Cập nhật danh sách sản phẩm thất bại!",
        data: [],
      });
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      message: "Cập nhật danh sách sản phẩm thành công",
      data: updatedProductSizes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const filterProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Tìm danh mục bằng categoryId
    const categorys = await category.findById(categoryId);

    if (!categorys) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Tìm tất cả sản phẩm thuộc danh mục đó
    const products = await product.find({ categoryId });

    return res.status(200).json({
      message: "Danh sách sản phẩm thuộc danh mục",
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
