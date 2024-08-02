import { Col, Row, Slider, message, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProduct } from "../../interface/Products";
import { ICategory } from "../../interface/Categories";
import { Link, useLocation } from "react-router-dom";
import { ACCESS_TOKEN_STORAGE_KEY } from "../../services/constants";
import useCartMutation from "../../hooks/useCart";
import { ISize } from "../../interface/Size";
import ProductItem from "../../components/ProductItem";

export default function Product() {
  const [product, setProduct] = useState<IProduct[]>([]);
  const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([200000, 500000]);
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  const location = useLocation();

  const { mutate } = useCartMutation({
    action: "ADD",
    onSuccess: () => {
      message.success("Đã thêm sản phẩm vào giỏ hàng");
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchSizes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/sizes`);
        // console.log("Sizes API response:", response.data);
        setSizes(response.data.data);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    };

    fetchCategories();
    fetchSizes();
  }, []);

  useEffect(() => {
    // Get search term from URL
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    console.log(searchQuery);

    const fetchProducts = async () => {
      try {
        let url = `http://localhost:3001/api/products`;
        const response = await axios.get(url, {
          params: { search: searchTerm },
        });
        console.log(response);

        setProduct(response.data?.data);
      } catch (error) {
        console.log("Không có dữ liệu");
      }
    };

    fetchProducts();
  }, [location.search]);

  useEffect(() => {
    const results = product.filter((products) =>
      products.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
    console.log(results);
  }, [searchTerm, product]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchProductsByCategory = async () => {
        try {
          let url = selectedCategory
            ? `http://localhost:3001/api/products/filter/category/${selectedCategory}`
            : `http://localhost:3001/api/products`;
          const response = await axios.get(url);
          setProduct(response.data?.data);
          console.log(response.data);
          
        } catch (error) {
          console.error("Error fetching products by category:", error);
        }
      };
      fetchProductsByCategory();
    }
  }, [selectedCategory]);

  const onAddCart = (productData: IProduct) => {
    if (!isLogged) {
      return message.info("Vui lòng đăng nhập tài khoản!");
    }

    mutate({
      productId: productData._id,
      quantity: 1,
    });
  };

  if (!product) return null;

  const handleSliderChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleFilterClick = async () => {
    const [minPrice, maxPrice] = priceRange;
    try {
      const response = await axios.get(
        "http://localhost:3001/api/products/filter/price",
        {
          params: { minPrice, maxPrice },
        }
      );
      if (response.data?.data.length === 0) {
        message.info("Không có sản phẩm nào trong khoảng giá này");
      }
      console.log("Filtered Products:", response.data);
      setProduct(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      message.error("Lỗi khi lọc sản phẩm");
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      <main>
        {/* <!-- breadcrumb area start --> */}
        <div className="breadcrumb-area">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-wrap">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/home">
                          <i className="fa fa-home"></i>
                        </a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Sản phẩm
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- breadcrumb area end --> */}

        {/* <!-- page main wrapper start --> */}
        <div className="shop-main-wrapper section-padding">
          <div className="container">
            <div className="row">
              {/* <!-- sidebar area start --> */}
              <div className="col-lg-3 order-2 order-lg-1">
                <aside className="sidebar-wrapper">
                  {/* <!-- single sidebar start --> */}
                  <div className="sidebar-single">
                    <h5 className="sidebar-title">
                      <span>Danh mục</span>
                    </h5>

                    <div className="sidebar-body">
                      <ul className="shop-categories">
                        {categories?.map((category) => (
                          <li key={category._id}>
                            <a
                              href="#"
                              onClick={() => handleCategoryClick(category._id)}
                            >
                              {category.loai}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  {/* <div className="sidebar-single">
                    <h5
                      className="sidebar-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Giá tiền</span>
                    </h5>

                    <div className="price-range-wrap">
                      <div className="range-slider">
                        <Slider
                          range
                          defaultValue={priceRange}
                          onChange={(value) =>
                            handleSliderChange(value as [number, number])
                          }
                          min={100000}
                          max={1000000}
                          step={50000}
                        />
                        <Button
                          className="filter-btn"
                          onClick={handleFilterClick}
                        >
                          Tìm kiếm
                        </Button>
                      </div>
                    </div>
                  </div> */}
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  {/* <div className="sidebar-single">
                    <h5
                      className="sidebar-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Kích cỡ</span>
                    </h5>

                    <div className="sidebar-body">
                      <ul className="checkbox-container categories-list">
                        {sizes.map((size, index) => (
                          <li key={size._id}>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`customCheck${index}`}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`customCheck${index}`}
                              >
                                {size.name}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div> */}
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  <div className="sidebar-banner">
                    <div className="img-container">
                      <a href="#">
                        <img
                          src="./src/assets/image/banner/sidebar-banner.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                  {/* <!-- single sidebar end --> */}
                </aside>
              </div>
              {/* <!-- sidebar area end --> */}

              {/* <!-- shop main wrapper start --> */}
              <div className="col-lg-9 order-1 order-lg-2">
                <div className="shop-product-wrapper">
                  {/* <!-- shop product top wrap start --> */}
                  <div className="shop-top-bar">
                    <div className="row align-items-center">
                      <div className="col-lg-7 col-md-6 order-2 order-md-1">
                        <div className="top-bar-left">
                          <div className="product-view-mode">
                            <a
                              href="#"
                              className="active"
                              data-target="grid-view"
                              data-bs-toggle="tooltip"
                              title="Grid View"
                            >
                              <i className="fa fa-th"></i>
                            </a>
                            <a
                              href="#"
                              data-target="list-view"
                              data-bs-toggle="tooltip"
                              title="List View"
                            >
                              <i className="fa fa-list"></i>
                            </a>
                          </div>
                          <div className="product-amount">
                            <p>Hiển thị 1-16 trên 21 kết quả</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- shop product top wrap start --> */}

                  {/* <!-- product item list wrapper start --> */}
                  <div className="shop-product-wrap grid-view row mbn-30">
                    <Row
                      gutter={16}
                      style={{ marginLeft: "6px", padding: "0px" }}
                    >
                      {product.map((p: IProduct) => (
                        <Col className="gutter-row" span={8} key={p._id}>
                          <ProductItem data={p} />
                        </Col>
                      ))}
                    </Row>
                  </div>
                  {/* <!-- product item list wrapper end --> */}

                  {/* <!-- start pagination area --> */}
                  <div className="paginatoin-area text-center">
                    <ul className="pagination-box">
                      <li>
                        <a href="#" className="previous">
                          <i className="pe-7s-angle-left"></i>
                        </a>
                      </li>
                      <li className="active">
                        <a href="#">1</a>
                      </li>
                      <li>
                        <a href="#">2</a>
                      </li>
                      <li>
                        <a href="#">3</a>
                      </li>
                      <li>
                        <a href="#" className="next">
                          <i className="pe-7s-angle-right"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- end pagination area --> */}
                </div>
              </div>
              {/* <!-- shop main wrapper end --> */}
            </div>
          </div>
        </div>
        {/* <!-- page main wrapper end --> */}
      </main>
    </div>
  );
}
