import { Col, Row, Slider } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProduct } from "../../interface/Products";
export default function Product() {
  const [product, setProduct] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products`);
        setProduct(response.data?.data);
      } catch (error) {
        console.log("Khong co du lieu");
      }
    };

    fetchProducts();
  }, []);

  if (!product) return null;
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
                        <li>
                          <a href="#">
                            Tất cả <span>(100)</span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            Nhẫn <span>(10)</span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            Dây chuyền <span>(5)</span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            Lắc tay <span>(8)</span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            Bông tai <span>(4)</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  <div className="sidebar-single">
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
                        <Slider range defaultValue={[20, 50]} />
                        <button className="filter-btn">Tìm kiếm</button>
                      </div>
                    </div>
                  </div>
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  <div className="sidebar-single">
                    <h5
                      className="sidebar-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Thương hiệu</span>
                    </h5>

                    <div className="sidebar-body">
                      <ul className="checkbox-container categories-list">
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck2"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck2"
                            >
                              Studio (3)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck3"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck3"
                            >
                              Hastech (4)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck4"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck4"
                            >
                              Quickiin (15)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck1"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck1"
                            >
                              Graphic corner (10)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck5"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck5"
                            >
                              devItems (12)
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  <div className="sidebar-single">
                    <h5
                      className="sidebar-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Màu sắc</span>
                    </h5>

                    <div className="sidebar-body">
                      <ul className="checkbox-container categories-list">
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck12"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck12"
                            >
                              black (20)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck13"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck13"
                            >
                              red (6)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck14"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck14"
                            >
                              blue (8)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck11"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck11"
                            >
                              green (5)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck15"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck15"
                            >
                              pink (4)
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  <div className="sidebar-single">
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
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck111"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck111"
                            >
                              S (4)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck222"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck222"
                            >
                              M (5)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck333"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck333"
                            >
                              L (7)
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck444"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck444"
                            >
                              XL (3)
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
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
                      <div className="col-lg-5 col-md-6 order-1 order-md-2">
                        <div className="top-bar-right">
                          <div className="product-short">
                            <p>Tìm kiếm theo :</p>
                            <select className="nice-select" name="sortby">
                              <option value="trending">Tìm kiếm theo</option>
                              <option value="sales">Tên (A - Z)</option>
                              <option value="sales">Tên (Z - A)</option>
                            </select>
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
                      {product.map((p, index) => (
                        <Col className="gutter-row" span={8}>
                          <div className="product-item">
                            <figure className="product-thumb">
                              <a href="#">
                                <img
                                  className="pri-img"
                                        src={p.image?.[0]}
                                  alt="product"
                                />
                                <img
                                  className="sec-img"
                                        src={p.image?.[0]}
                                  alt="product"
                                />
                              </a>
                              <div className="product-badge">
                                <div className="product-label new">
                                  <span>HOT</span>
                                </div>
                              </div>
                              <div className="button-group">
                                <a
                                  href="#"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="left"
                                  title="Yêu thích"
                                >
                                  <i className="pe-7s-like"></i>
                                </a>
                                <a
                                  href="#"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="left"
                                  title="So sánhpare"
                                >
                                  <i className="pe-7s-refresh-2"></i>
                                </a>
                                <a
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#quick_view"
                                >
                                  <span
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="Xem chi tiết"
                                  >
                                    <i className="pe-7s-search"></i>
                                  </span>
                                </a>
                              </div>
                              <div className="cart-hover">
                                <button className="btn btn-cart">
                                  Thêm vào giỏ hàng
                                </button>
                              </div>
                              <div className="product-caption text-center">
                                <div className="product-identity">
                                  <p className="manufacturer-name">
                                    <a href="#">{p.name}</a>
                                  </p>
                                </div>
                                <ul className="color-categories">
                                  <li>
                                    <a
                                      href="#"
                                      className="c-lightblue"
                                      title="LightSteelblue"
                                    ></a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      className="c-darktan"
                                      title="Darktan"
                                    ></a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      className="c-grey"
                                      title="Grey"
                                    ></a>
                                  </li>
                                  <li>
                                    <a
                                      href="#"
                                      className="c-brown"
                                      title="Brown"
                                    ></a>
                                  </li>
                                </ul>
                                {/* <h6 className="product-name">
                                  <a href="#">Sản phẩm {index + 1}</a>
                                </h6> */}
                                <div className="price-box">
                                  <span className="price-regular">
                                    {p.price + " "} VNĐ
                                  </span>
                                  <span className="price-old">
                                    <del>{p.price + " "}VND</del>
                                  </span>
                                </div>
                              </div>
                            </figure>
                          </div>
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
