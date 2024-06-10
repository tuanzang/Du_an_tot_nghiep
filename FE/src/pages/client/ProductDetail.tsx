import { Carousel, Col, Image, Row } from "antd";
import React, { useState } from "react";

export default function ProductDetail() {
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
      key: i,
      image1: `../src/assets/image/product/product-${i}.jpg`,
      image2: `../src/assets/image/product/product-${19 - i}.jpg`,
      title: getTitle(i),
      price: (i * 10 + 9.99).toFixed(2),
      category: `Category ${i}`,
    });
    fakeHotProduct2s.push({
      key: i,
      image1: `../src/assets/image/product/product-${i + 1}.jpg`,
      image2: `../src/assets/image/product/product-${19 - i - 1}.jpg`,
      title: getTitle(i),
      price: (i * 10 + 9.99).toFixed(2),
      category: `Category ${i}`,
    });
  }

  const [imgDetail, setImgDetail] = useState(fakeHotProduct1s[0].image1);

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
                        <a href="/product">Sản phẩm</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Sản phẩm chi tiết
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
        <div className="shop-main-wrapper section-padding pb-0">
          <div className="container">
            <div className="row" style={{ marginBottom: "5rem" }}>
              {/* <!-- product details wrapper start --> */}
              <div className="col-lg-12 order-1 order-lg-2">
                {/* <!-- product details inner end --> */}
                <div className="product-details-inner">
                  <div className="row">
                    <div className="col-lg-5">
                      <div
                        className="pro-large-img img-zoom"
                        style={{ marginBottom: "10px" }}
                      >
                        <Image
                          width={"100%"}
                          src={imgDetail}
                          alt="product-details"
                        />
                      </div>
                      <div className="tab-content">
                        <Carousel
                          autoplay
                          autoplaySpeed={3000}
                          slidesToShow={4}
                          slidesToScroll={1}
                          arrows={false}
                          dots={false}
                        >
                          {fakeHotProduct1s.map((p) => (
                            <Col
                              key={p.key}
                              className="gutter-row"
                              span={24}
                              style={{
                                justifyContent: "center",
                                alignContent: "center",
                                display: "flex",
                              }}
                            >
                              <Image
                                onClick={(e) => {
                                  e.preventDefault();
                                  setImgDetail(p.image1);
                                }}
                                width={"95%"}
                                height={"95%"}
                                sizes="small"
                                preview={false}
                                src={p.image1}
                              />
                            </Col>
                          ))}
                        </Carousel>
                      </div>
                    </div>
                    <div className="col-lg-7">
                      <div className="product-details-des">
                        <div className="manufacturer-name">
                          <a href="product-details.html">HasTech</a>
                        </div>
                        <h3 className="product-name">
                          Handmade Golden Necklace Full Family Package
                        </h3>
                        <div className="ratings d-flex">
                          <span>
                            <i className="fa fa-star-o"></i>
                          </span>
                          <span>
                            <i className="fa fa-star-o"></i>
                          </span>
                          <span>
                            <i className="fa fa-star-o"></i>
                          </span>
                          <span>
                            <i className="fa fa-star-o"></i>
                          </span>
                          <span>
                            <i className="fa fa-star-o"></i>
                          </span>
                          <div className="pro-review">
                            <span>1 Reviews</span>
                          </div>
                        </div>
                        <div className="price-box">
                          <span className="price-regular">$70.00</span>
                          <span className="price-old">
                            <del>$90.00</del>
                          </span>
                        </div>
                        <h5 className="offer-text">
                          <strong>Hurry up</strong>! offer ends in:
                        </h5>
                        <div
                          className="product-countdown"
                          data-countdown="2022/12/20"
                        ></div>
                        <div className="availability">
                          <i className="fa fa-check-circle"></i>
                          <span>200 in stock</span>
                        </div>
                        <p className="pro-desc">Mô tả sản phẩm</p>
                        <div className="quantity-cart-box d-flex align-items-center">
                          <h6 className="option-title">qty:</h6>
                          <div className="quantity">
                            <div className="pro-qty">
                              <input type="text" value="1" />
                            </div>
                          </div>
                          <div className="action_link">
                            <a className="btn btn-cart2" href="#">
                              Add to cart
                            </a>
                          </div>
                        </div>
                        <div class="useful-links">
                          <a href="#" data-bs-toggle="tooltip" title="Compare">
                            <i class="pe-7s-refresh-2"></i>compare
                          </a>
                          <a href="#" data-bs-toggle="tooltip" title="Wishlist">
                            <i class="pe-7s-like"></i>wishlist
                          </a>
                        </div>
                        <div class="like-icon">
                          <a class="facebook" href="#">
                            <i class="fa fa-facebook"></i>like
                          </a>
                          <a class="twitter" href="#">
                            <i class="fa fa-twitter"></i>tweet
                          </a>
                          <a class="pinterest" href="#">
                            <i class="fa fa-pinterest"></i>save
                          </a>
                          <a class="google" href="#">
                            <i class="fa fa-google-plus"></i>share
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- product details inner end --> */}

                {/* <!-- product details reviews start --> */}
                <div className="product-details-reviews section-padding pb-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="product-review-info">
                        <ul className="nav review-tab">
                          <li>
                            <a
                              className="active"
                              data-bs-toggle="tab"
                              href="#tab_one"
                            >
                              Mô tả
                            </a>
                          </li>
                          <li>
                            <a data-bs-toggle="tab" href="#tab_two">
                              Thông tin
                            </a>
                          </li>
                          <li>
                            <a data-bs-toggle="tab" href="#tab_three">
                              bình luận và đánh giá
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content reviews-tab">
                          <div
                            className="tab-pane fade show active"
                            id="tab_one"
                          >
                            <div className="tab-one">
                              <p>Mô tả sản phẩm</p>
                            </div>
                          </div>
                          <div className="tab-pane fade" id="tab_two">
                            <table className="table table-bordered">
                              <tbody>
                                <tr>
                                  <td>color</td>
                                  <td>black, blue, red</td>
                                </tr>
                                <tr>
                                  <td>size</td>
                                  <td>L, M, S</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="tab-pane fade" id="tab_three">
                            <form action="#" className="review-form">
                              <h5>
                                1 review for <span>Chaz Kangeroo</span>
                              </h5>
                              <div className="total-reviews">
                                <div className="rev-avatar">
                                  <img
                                    src="../src/assets/img/about/avatar.jpg"
                                    alt=""
                                  />
                                </div>
                                <div className="review-box">
                                  <div className="ratings">
                                    <span className="good">
                                      <i className="fa fa-star"></i>
                                    </span>
                                    <span className="good">
                                      <i className="fa fa-star"></i>
                                    </span>
                                    <span className="good">
                                      <i className="fa fa-star"></i>
                                    </span>
                                    <span className="good">
                                      <i className="fa fa-star"></i>
                                    </span>
                                    <span>
                                      <i className="fa fa-star"></i>
                                    </span>
                                  </div>
                                  <div className="post-author">
                                    <p>
                                      <span>admin -</span> 30 Mar, 2019
                                    </p>
                                  </div>
                                  <p>
                                    Aliquam fringilla euismod risus ac bibendum.
                                    Sed sit amet sem varius ante feugiat
                                    lacinia. Nunc ipsum nulla, vulputate ut
                                    venenatis vitae, malesuada ut mi. Quisque
                                    iaculis, dui congue placerat pretium, augue
                                    erat accumsan lacus
                                  </p>
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col">
                                  <label className="col-form-label">
                                    <span className="text-danger">*</span>
                                    Your Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col">
                                  <label className="col-form-label">
                                    <span className="text-danger">*</span>
                                    Your Email
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col">
                                  <label className="col-form-label">
                                    <span className="text-danger">*</span>
                                    Your Review
                                  </label>
                                  <textarea
                                    className="form-control"
                                    required
                                  ></textarea>
                                  <div className="help-block pt-10">
                                    <span className="text-danger">Note:</span>
                                    HTML is not translated!
                                  </div>
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col">
                                  <label className="col-form-label">
                                    <span className="text-danger">*</span>
                                    Rating
                                  </label>
                                  &nbsp;&nbsp;&nbsp; Bad&nbsp;
                                  <input type="radio" value="1" name="rating" />
                                  &nbsp;
                                  <input type="radio" value="2" name="rating" />
                                  &nbsp;
                                  <input type="radio" value="3" name="rating" />
                                  &nbsp;
                                  <input type="radio" value="4" name="rating" />
                                  &nbsp;
                                  <input
                                    type="radio"
                                    value="5"
                                    name="rating"
                                    checked
                                  />
                                  &nbsp;Good
                                </div>
                              </div>
                              <div className="buttons">
                                <button className="btn btn-sqr" type="submit">
                                  Continue
                                </button>
                              </div>
                            </form>
                            {/* <!-- end of review-form --> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- product details reviews end --> */}
              </div>
              {/* <!-- product details wrapper end --> */}
            </div>
            <div className="row" style={{ marginBottom: "5rem" }}>
              <div className="row">
                <div className="col-12">
                  {/* <!-- section title start --> */}
                  <div className="section-title text-center">
                    <h2 className="title">Sản phẩm liên quan</h2>
                    <p className="sub-title">Sản phẩm liên quan</p>
                  </div>
                  {/* <!-- section title start --> */}
                </div>
              </div>
              {/* <!-- product tab content start --> */}
              <div className="tab-content">
                <Carousel autoplay autoplaySpeed={5000}>
                  {/* <!-- product item start --> */}
                  <div className="tab-pane fade show active">
                    <div className="product-carousel-4 slick-row-10 slick-arrow-style">
                      <Row gutter={16}>
                        {fakeHotProduct1s.map((p, index) => (
                          <Col key={p.key} className="gutter-row" span={6}>
                            <div className="product-item">
                              <figure className="product-thumb">
                                <a href="#">
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
                                      <a href="#">{p.title}</a>
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
                                  <h6 className="product-name">
                                    <a href="#">Sản phẩm {index + 1}</a>
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
                  </div>
                  {/* <!-- product item end --> */}

                  {/* <!-- product item start --> */}
                  <div className="tab-pane fade show active">
                    <div className="product-carousel-4 slick-row-10 slick-arrow-style">
                      <Row gutter={16}>
                        {fakeHotProduct2s.map((p, index) => (
                          <Col key={p.key} className="gutter-row" span={6}>
                            <div className="product-item">
                              <figure className="product-thumb">
                                <a href="#">
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
                                      <a href="#">{p.title}</a>
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
                                  <h6 className="product-name">
                                    <a href="#">Sản phẩm {index + 1}</a>
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
                  </div>
                  {/* <!-- product item end --> */}
                </Carousel>
              </div>
              {/* <!-- product tab content end --> */}
            </div>
          </div>
        </div>
        {/* <!-- page main wrapper end --> */}
      </main>
    </div>
  );
}
