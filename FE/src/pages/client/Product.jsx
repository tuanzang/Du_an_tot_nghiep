import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Col, Row, Slider } from "antd";
import React, { useState } from "react";
export default function Product() {
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openSize, setOpenSize] = useState(false);

  // data fake
  const getTitle = (number) => {
    switch (number) {
      case 1:
        return "GOLD";
      case 2:
        return "SLIVER";
      case 3:
        return "BRONZE";
      case 4:
        return "DIAMOND";
    }
  };

  const fakeHotProduct1s = [];
  const fakeHotProduct2s = [];
  for (let i = 1; i <= 4; i++) {
    fakeHotProduct1s.push({
      image1: `./src/assets/image/product/product-${i}.jpg`,
      image2: `./src/assets/image/product/product-${19 - i}.jpg`,
      title: getTitle(i),
      price: (i * 10 + 9.99).toFixed(2),
      category: `Category ${i}`,
    });
    fakeHotProduct2s.push({
      image1: `./src/assets/image/product/product-${i + 1}.jpg`,
      image2: `./src/assets/image/product/product-${19 - i - 1}.jpg`,
      title: getTitle(i),
      price: (i * 10 + 9.99).toFixed(2),
      category: `Category ${i}`,
    });
  }
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
                    <h5
                      className="sidebar-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Danh mục</span>
                      {openCategory ? (
                        <DownOutlined
                          onClick={() => setOpenCategory(!openCategory)}
                        />
                      ) : (
                        <UpOutlined
                          onClick={() => setOpenCategory(!openCategory)}
                        />
                      )}
                    </h5>
                    {openCategory && (
                      <div className="sidebar-body">
                        <ul className="shop-categories">
                          <li>
                            <a>
                              Tất cả <span>(100)</span>
                            </a>
                          </li>
                          <li>
                            <a>
                              Nhẫn <span>(10)</span>
                            </a>
                          </li>
                          <li>
                            <a>
                              Dây chuyền <span>(5)</span>
                            </a>
                          </li>
                          <li>
                            <a>
                              Lắc tay <span>(8)</span>
                            </a>
                          </li>
                          <li>
                            <a>
                              Bông tai <span>(4)</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
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
                      {openPrice ? (
                        <DownOutlined
                          onClick={() => setOpenPrice(!openPrice)}
                        />
                      ) : (
                        <UpOutlined onClick={() => setOpenPrice(!openPrice)} />
                      )}
                    </h5>
                    {openPrice && (
                      <div className="price-range-wrap">
                        <div className="range-slider">
                          <Slider range defaultValue={[20, 50]} />
                          <button className="filter-btn">Tìm kiếm</button>
                        </div>
                      </div>
                    )}
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
                      {openBrand ? (
                        <DownOutlined
                          onClick={() => setOpenBrand(!openBrand)}
                        />
                      ) : (
                        <UpOutlined onClick={() => setOpenBrand(!openBrand)} />
                      )}
                    </h5>
                    {openBrand && (
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
                                for="customCheck2"
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
                                for="customCheck3"
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
                                for="customCheck4"
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
                                for="customCheck1"
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
                                for="customCheck5"
                              >
                                devItems (12)
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
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
                      {openColor ? (
                        <DownOutlined
                          onClick={() => setOpenColor(!openColor)}
                        />
                      ) : (
                        <UpOutlined onClick={() => setOpenColor(!openColor)} />
                      )}
                    </h5>
                    {openColor && (
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
                                for="customCheck12"
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
                                for="customCheck13"
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
                                for="customCheck14"
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
                                for="customCheck11"
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
                                for="customCheck15"
                              >
                                pink (4)
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
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
                      {openSize ? (
                        <DownOutlined onClick={() => setOpenSize(!openSize)} />
                      ) : (
                        <UpOutlined onClick={() => setOpenSize(!openSize)} />
                      )}
                    </h5>
                    {openSize && (
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
                                for="customCheck111"
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
                                for="customCheck222"
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
                                for="customCheck333"
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
                                for="customCheck444"
                              >
                                XL (3)
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* <!-- single sidebar end --> */}

                  {/* <!-- single sidebar start --> */}
                  <div className="sidebar-banner">
                    <div className="img-container">
                      <a>
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
                              className="active"
                              data-target="grid-view"
                              data-bs-toggle="tooltip"
                              title="Grid View"
                            >
                              <i className="fa fa-th"></i>
                            </a>
                            <a
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
                      {fakeHotProduct1s.map((p, index) => (
                        <Col className="gutter-row" span={8}>
                          <div className="product-item">
                            <figure className="product-thumb">
                              <a>
                                <img
                                  className="pri-img"
                                  src={p.image1}
                                  alt="product"
                                />
                                <img
                                  className="sec-img"
                                  src={p.image2}
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
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="left"
                                  title="Yêu thích"
                                >
                                  <i className="pe-7s-like"></i>
                                </a>
                                <a
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="left"
                                  title="So sánhpare"
                                >
                                  <i className="pe-7s-refresh-2"></i>
                                </a>
                                <a
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
                                    <a>{p.title}</a>
                                  </p>
                                </div>
                                <ul className="color-categories">
                                  <li>
                                    <a
                                      className="c-lightblue"
                                      title="LightSteelblue"
                                    ></a>
                                  </li>
                                  <li>
                                    <a
                                      className="c-darktan"
                                      title="Darktan"
                                    ></a>
                                  </li>
                                  <li>
                                    <a className="c-grey" title="Grey"></a>
                                  </li>
                                  <li>
                                    <a className="c-brown" title="Brown"></a>
                                  </li>
                                </ul>
                                <h6 className="product-name">
                                  <a>Sản phẩm {index + 1}</a>
                                </h6>
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
                        <a className="previous">
                          <i className="pe-7s-angle-left"></i>
                        </a>
                      </li>
                      <li className="active">
                        <a>1</a>
                      </li>
                      <li>
                        <a>2</a>
                      </li>
                      <li>
                        <a>3</a>
                      </li>
                      <li>
                        <a className="next">
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
