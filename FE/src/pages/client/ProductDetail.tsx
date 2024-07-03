import { Carousel, Col, Image, Row, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProduct } from "../../interface/Products";
import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY } from "../../services/constants";
import useCartMutation from "../../hooks/useCart";

export default function ProductDetail() {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL params
  const [product, setProduct] = useState<IProduct>();
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [quantity, setQuantity] = useState(1); // State for quantity

  const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const { mutate } = useCartMutation({
    action: "ADD",
    onSuccess: () => {
      message.success("Đã thêm sản phẩm vào giỏ hàng");
    },
  });

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]); // Thêm id vào dependency array để gọi lại API khi id thay đổi

  const fetchProduct = async () => {
    try {
      if (id) {
        const response = await axios.get(`http://localhost:3001/api/products/${id}`);
        console.log("Product API response:", response.data);
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products`);
      console.log("Related Products API response:", response.data);
      setRelatedProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityDecrease = () => {
    setQuantity(quantity > 1 ? quantity - 1 : 1); // Giới hạn số lượng không được dưới 1
  };

  const handleQuantityChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = Number((event.target as HTMLInputElement).value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const onAddCart = (productData: IProduct) => {
    if (!isLogged) {
      return message.info("Vui lòng đăng nhập tài khoản!");
    }

    if (productData) {
      mutate({
        productId: productData._id,
        quantity: quantity, // Use the state quantity here
      });
    }
  };

  return (
    <div>
      <main>
        {/* breadcrumb area start */}
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
                      <li className="breadcrumb-item active" aria-current="page">
                        <a href="/product">Sản phẩm</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Sản phẩm chi tiết
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* breadcrumb area end */}

        {/* page main wrapper start */}
        <div className="shop-main-wrapper section-padding pb-0">
          <div className="container">
            <div className="row" style={{ marginBottom: "5rem" }}>
              {/* product details wrapper start */}
              <div className="col-lg-12 order-1 order-lg-2">
                {/* product details inner end */}
                <div className="product-details-inner">
                  <div className="row">
                    <div className="col-lg-5">
                      <div className="pro-large-img img-zoom" style={{ marginBottom: "10px" }}>
                        <Image
                          width={"100%"}
                          src={product?.image?.[0]}
                          alt="product-details"
                        />
                      </div>
                      <div className="tab-content"></div>
                    </div>
                    <div className="col-lg-7">
                      <div className="product-details-des">
                        <div className="manufacturer-name">
                          <a href="#">HOT</a>
                        </div>
                        <h3 className="product-name">{product?.name}</h3>
                        <div className="price-box">
                          <span className="price-regular">
                            {product?.price} VNĐ
                          </span>
                          <span className="price-old">
                            <del>{product?.priceOld} VNĐ</del>
                          </span>
                        </div>
                        <div className="availability">
                          <i className="fa fa-check-circle"></i>
                          <span>200 in stock</span>
                        </div>
                        <p className="pro-desc">Mô tả sản phẩm:</p>
                        <p>{product?.description}</p>
                        <div className="quantity-cart-box d-flex align-items-center">
                          <h6 className="option-title">Số lượng:</h6>
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={handleQuantityDecrease}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={quantity}
                              onChange={handleQuantityChange}
                              min="1"
                              className="quantity-input"
                            />
                            <button
                              className="quantity-btn"
                              onClick={handleQuantityIncrease}
                            >
                              +
                            </button>
                          </div>
                          <div className="action_link">
                            <button
                              className="btn btn-cart2"
                              onClick={product ? () => onAddCart(product) : undefined}
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div>
                        </div>
                        <div className="useful-links">
                          <a href="#" data-bs-toggle="tooltip" title="Compare">
                            <i className="pe-7s-refresh-2"></i>compare
                          </a>
                          <a href="#" data-bs-toggle="tooltip" title="Wishlist">
                            <i className="pe-7s-like"></i>wishlist
                          </a>
                        </div>
                        <div className="like-icon">
                          <a className="facebook" href="#">
                            <i className="fa fa-facebook"></i>like
                          </a>
                          <a className="twitter" href="#">
                            <i className="fa fa-twitter"></i>tweet
                          </a>
                          <a className="pinterest" href="#">
                            <i className="fa fa-pinterest"></i>save
                          </a>
                          <a className="google" href="#">
                            <i className="fa fa-google-plus"></i>share
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* product details inner end */}

                {/* product details reviews start */}
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
                              Bình luận và đánh giá
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div id="tab_one" className="tab-pane fade show active">
                            <div className="product-tab-content">
                              <h6 className="product-tab-title">Mô tả sản phẩm</h6>
                              <p>{product?.description}</p>
                            </div>
                          </div>
                          <div id="tab_two" className="tab-pane fade">
                            <div className="product-tab-content">
                              <h6 className="product-tab-title">Thông tin sản phẩm</h6>
                              <ul>
                                <li>
                                  {/* <span>Danh mục:</span> {product?.category} */}
                                </li>
                                <li>
                                  {/* <span>Thương hiệu:</span> {product?.brand} */}
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div id="tab_three" className="tab-pane fade">
                            <div className="product-tab-content">
                              <div className="reviews">
                                <div className="review-content">
                                  <div className="rev-author">
                                    <img
                                      src="https://via.placeholder.com/100"
                                      alt="avatar"
                                    />
                                  </div>
                                  <div className="rev-content">
                                    <div className="post-author">
                                      <p>
                                        <span>Admin -</span> 30 Jan, 2019
                                      </p>
                                    </div>
                                    <p>
                                      Aliquam dignissim nonummy ultricies. Nulla
                                      quis nibh. Proin ac neque. Nunc tincidunt
                                      ante vitae massa. Donec viverra, pede ac
                                      diam. Cras interdum. Nunc tincidunt ante
                                      vitae massa. Donec viverra, pede ac diam.
                                      Cras interdum.
                                    </p>
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <div className="col">
                                    <label className="col-form-label">
                                      Your Rating
                                    </label>
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
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <div className="col">
                                    <label htmlFor="review" className="col-form-label">
                                      Your Review
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="review"
                                      rows={3}
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <div className="col">
                                    <label htmlFor="name" className="col-form-label">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="name"
                                    />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <div className="col">
                                    <label htmlFor="email" className="col-form-label">
                                      Email
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="email"
                                    />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <div className="col">
                                    <button className="btn btn-secondary">
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* product details reviews end */}
              </div>
              {/* product details wrapper end */}
            </div>
            {/* Sản phẩm liên quan */}
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
                  <div className="tab-pane fade show active">
                    <div className="product-carousel-4 slick-row-10 slick-arrow-style">
                      <Row gutter={16}>
                        {relatedProducts.map((relatedProduct) => (
                          <Col key={relatedProduct._id} className="gutter-row" span={6}>
                            <div className="product-item">
                              <figure className="product-thumb">
                                <a href="#">
                                  <img
                                    className="pri-img"
                                    src={relatedProduct?.image?.[0]}
                                    alt="product"
                                  />
                                  <img
                                    className="sec-img"
                                    src={relatedProduct?.image?.[0]}
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
                                    title="So sánh"
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
                                      <a href="#">{relatedProduct.name}</a>
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
                                  <div className="price-box">
                                    <span className="price-regular">
                                      {relatedProduct.price} VNĐ
                                    </span>
                                    <span className="price-old">
                                      <del>{relatedProduct.priceOld} VNĐ</del>
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