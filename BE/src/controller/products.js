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

    const getProductsPromise = data.map(async (item) => {
      const variants = await productSize.find({ idProduct: item._id }).exec();

      return {
        ...item.toJSON(),
        variants,
      };
    });

    const products = await Promise.all(getProductsPromise);

    return res.status(200).json({
      message: "Danh sách sản phẩm",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  const { name } = req.body;

  try {
    const products = await product.find({
      name: { $regex: name, $options: "i" }, // Sửa đối tượng tìm kiếm ở đây
    });

    if (products.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy sản phẩm!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Danh sách sản phẩm tìm được",
      data: products,
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
    const productSizedata = await productSize.find({
      idProduct: req.params.id,
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm !",
        data: [],
      });
    }

    data.productSize = productSizedata;

    return res.status(200).json({
      message: "Đã tìm thấy sản phẩm",
      data: {
        ...data.toJSON(),
        productSizedata,
      },
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

export const updateProductSizes = async (req, res) => {
  const idProduct = req.params.id;
  const requestData = req.body; // Lấy danh sách productSize từ req.body

  try {
    await productSize.deleteMany({
      idProduct, 
    })

    const transformData = Object.keys(requestData);

    const body = transformData.reduce((total, curr) => {
      if (curr.startsWith("price")) {
        const [_, idSize] = curr.split("-");
        const isExists = total.find((it) => it.idSize === idSize);

        const quantity = requestData[`quantity-${idSize}`];
        const price = requestData[`price-${idSize}`];

        if (!isExists) {
          total.push({
            idProduct,
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

    const productSizeUpdated = await productSize.insertMany(transformBody);

    return res.json({
      message: 'Cập nhật thành công',
      productSizeUpdated
    })
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
    const data = await productSize.find({ price: priceFilter });

    if (!data || data.length === 0) {
      return res.status(200).json({
        message: `Không có sản phẩm nào trong khoảng giá từ ${minPrice} đến ${maxPrice}!`,
        data: [],
      });
    }

    const getProductsPromise = data.map(async (item) => {
      const variants = await productSize.find({ idProduct: item.idProduct }).exec();
      return {
        ...item.toJSON(),
        variants,
      };
    });

    const products = await Promise.all(getProductsPromise);

    return res.status(200).json({
      message: `Danh sách sản phẩm trong khoảng giá từ ${minPrice} đến ${maxPrice}`,
      data: products
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
    const data = await product.find({ categoryId });

    const getProductsPromise = data.map(async (item) => {
      const variants = await productSize.find({ idProduct: item.idProduct }).exec();
      return {
        ...item.toJSON(),
        variants,
      };
    });

    const products = await Promise.all(getProductsPromise);

    return res.status(200).json({
      message: "Danh sách sản phẩm thuộc danh mục",
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
