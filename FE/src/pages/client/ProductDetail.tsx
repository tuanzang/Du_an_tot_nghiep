import { Carousel, Col, Image, Row, message, Button } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProduct } from "../../interface/Products";
import axios from "axios";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_INFO_STORAGE_KEY,
} from "../../services/constants";
import useCartMutation from "../../hooks/useCart";
import dayjs from "dayjs";
import { IComment } from "../../interface/Comments";
import { IUser } from "../../interface/Users";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ISize } from "../../interface/Size";
import { IProductSize } from "../../interface/ProductSize";

export default function ProductDetail() {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL params
  const [product, setProduct] = useState<IProduct>();
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [productSizes, setProductSizes] = useState<IProductSize[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleSizeClick = (sizeId: any) => {
    if (selectedSize === sizeId) {
      setSelectedSize(null);
    } else {
      setSelectedSize(sizeId);
    }
  };

  // lấy thông tin user đăng nhập
  const isLoggedUser = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLoggedUser ? JSON.parse(isLoggedUser) : null;

  // lấy token đăng nhập
  const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const { mutate } = useCartMutation({
    action: "ADD",
    onSuccess: () => {
      message.success("Đã thêm sản phẩm vào giỏ hàng");
    },
  });

  useEffect(() => {
    fetchProduct(String(id));
    fetchRelatedProducts();
    fetchSizes();
    // findUserById(idUser ? idUser : null);
  }, [id]); // Thêm id vào dependency array để gọi lại API khi id thay đổi

  const fetchProduct = async (id: string) => {
    try {
      if (id) {
        const response = await axios.get(
          `http://localhost:3001/api/products/${id}`
        );
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

  const fetchSizes = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/sizes`);
      console.log("Sizes API response:", response.data);
      setSizes(response.data.data);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  useEffect(() => {
    // Gọi API để lấy số lượng sản phẩm theo kích cỡ
    const fetchProductSizes = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/products/productSize/${id}`);
        setProductSizes(data.data);

        // Cập nhật state quantities
        const initialQuantities: { [key: string]: number } = {};
        data.data.forEach((productSize: IProductSize) => {
          initialQuantities[productSize.sizeName] = productSize.quantity;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching product sizes:', error);
      }
    };

    fetchProductSizes();
  }, [id]);

  
  // Tính tổng số lượng tất cả các size
  const totalQuantity = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

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

  /** API bình luận sản phẩm */
  const [listComment, setListComment] = useState<IComment[]>([]);
  const fetchComment = async (idProduct: string | null) => {
    if (idProduct === null) {
      return setListComment([]);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/comments/findByIdProduct",
          {
            idProduct: idProduct,
          }
        );
        setListComment(response.data?.data);
      } catch (error) {
        console.log("Khong co du lieu");
      }
    }
  };

  const [textComment, setTextComment] = useState("");
  const [newComment, setNewComment] = useState<IComment | null>({
    _id: "",
    idUser: "",
    idProduct: "",
    fullName: "",
    productName: "",
    avatar: "",
    comment: "",
    createdAt: "",
  });
  const handleChangeTextComment = (comment: string) => {
    setTextComment(comment);

    // Giả sử rằng `product` và `user` đã được xác định trước đó
    changeDataComment(comment);
  };
  const changeDataComment = (comment: string) => {
    if (product === undefined || user === null) {
      toast.warning("Không thể comment!");
      return;
    }
    setNewComment({
      _id: null,
      idUser: user._id,
      idProduct: String(product._id),
      fullName: user.name,
      productName: product.name,
      avatar: user.avatar,
      comment: comment,
      createdAt: "",
    });
  };
  const createComment = async (newComment: IComment | null) => {
    if (
      newComment?.comment === "" ||
      newComment?.comment === undefined ||
      newComment?.comment === null
    ) {
      toast.warning("Bạn chưa nhập bình luận!");
      return;
    }
    if (newComment === null) {
      toast.error("Không thể bình luận");
      return;
    }

    try {
      // Gửi yêu cầu tạo bình luận
      await axios.post("http://localhost:3001/api/comments/add", newComment);
      fetchComment(newComment.idProduct);
      setTextComment("");
      setNewComment(null);
      toast.success("Bình luận thành công");
    } catch (error) {
      console.error("Error creating comment:", error); // In lỗi ra console để kiểm tra
      toast.error("Bình luận thất bại");
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
                      <div
                        className="pro-large-img img-zoom"
                        style={{ marginBottom: "10px" }}
                      >
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
                        {/* <div className="availability">
                          <i className="fa fa-check-circle"></i>
                          <span>200 in stock</span>
                        </div> */}

                        <div>
                          <div className="button-container mt-2">
                            {sizes.map((size) => (
                              <Button
                                key={size._id}
                                className={`mx-1 ${
                                  selectedSize === size._id ? "selected" : ""
                                }`}
                                style={{
                                  padding: "10px 20px",
                                  fontSize: "16px",
                                }}
                                onClick={() => handleSizeClick(size._id)}
                              >
                                {size.name}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-2">
                          <p>Còn {totalQuantity} sản phẩm</p>
                        </div>

                        <p className="pro-desc mt-3">Mô tả sản phẩm:</p>
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
                            <div className="action_link">
                              <button
                                className="btn btn-cart2"
                                onClick={
                                  product ? () => onAddCart(product) : undefined
                                }
                              >
                                Thêm vào giỏ hàng
                              </button>
                            </div>
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
                          <ul
                            className="nav review-tab"
                            style={{
                              margin: "30px",
                            }}
                          >
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
                            <li onClick={() => fetchComment(id ? id : null)}>
                              <a data-bs-toggle="tab" href="#tab_three">
                                Bình luận
                              </a>
                            </li>
                          </ul>
                          <div className="tab-content">
                            <div
                              id="tab_one"
                              className="tab-pane fade show active"
                            >
                              <div className="product-tab-content">
                                <h6 className="product-tab-title">
                                  Mô tả sản phẩm
                                </h6>
                                <p>{product?.description}</p>
                              </div>
                            </div>
                            <div id="tab_two" className="tab-pane fade">
                              <div className="product-tab-content">
                                <h3 className="product-tab-title">
                                  Hướng dẫn đo size nhẫn
                                </h3>
                                <ul>
                                  <li>
                                    {" "}
                                    <img
                                      src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/451834400_1143488730215335_8162184727999743406_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=A3J78wJhMkcQ7kNvgHH0Lvb&_nc_ht=scontent.fhan17-1.fna&oh=00_AYD4m8sTtmS14USujkQ3BA48rTU7FtPSsapkyyP3wl1duw&oe=669F95A7"
                                      alt="" width={"70%"}
                                    />
                                  </li>
                                  <hr />
                                  <li>
                                    <h3>
                                      Những cách đơn giản nhất để đo nhẫn:
                                    </h3>
                                    <h5>Đo bằng tờ giấy và thước</h5>
                                    <span style={{ fontSize: "20px" }}>
                                      Bước 1: Chuẩn bị một cây thước, 1 cây kéo,
                                      1 cây bút & một tờ giấy <br /> Bước 2: Cắt
                                      một mảnh giấy dài khoảng 10 cm và rộng 1
                                      cm. <br />
                                      Bước 3: Sử dụng đoạn giấy vừa cắt để quấn
                                      sát quanh ngón tay muốn đo. <br /> Bước 4:
                                      Đánh dấu điểm giao nhau. <br /> Bước 5:
                                      Tháo ra dùng thước đo chiều dài của đoạn
                                      giấy từ điểm đầu cho đến phần đánh dấu.
                                      Lấy kết quả đo được chia cho 3,14. Sau đó
                                      đối chiếu với Bảng size nhẫn.
                                    </span>
                                    <img
                                      src="https://www.pnj.com.vn/blog/wp-content/uploads/2021/11/huong-dan-do-size-nhan-2.jpg"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <h5>Đo theo một chiếc nhẫn có sẵn</h5>
                                    <span style={{ fontSize: "20px" }}>
                                      Bước 1: Chuẩn bị một cây thước cùng chiếc
                                      nhẫn muốn đo. <br /> Bước 2: Đối chiếu số
                                      mm của thước với kích thước trên BẢNG SIZE
                                      NHẪN bên trên.
                                    </span>
                                    <img
                                      src="https://www.pnj.com.vn/blog/wp-content/uploads/2021/11/huong-dan-do-size-nhan-3.jpg"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div id="tab_three" className="tab-pane fade">
                              <div className="product-tab-content">
                                <div className="reviews">
                                  <div
                                    className="reviews"
                                    style={{
                                      maxHeight: "310px",
                                      overflowY: "scroll", // Cho phép cuộn nội dung theo chiều dọc
                                      scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
                                      msOverflowStyle: "none", // Ẩn thanh cuộn trên IE và Edge
                                    }}
                                  >
                                    {listComment.length > 0 ? (
                                      listComment.map((comment) => (
                                        <div
                                          className="review-content"
                                          key={comment._id}
                                        >
                                          <div className="rev-author">
                                            <img
                                              src={comment.avatar}
                                              alt="avatar"
                                              style={{ marginRight: "10px" }}
                                            />
                                            <span>{comment.fullName}</span>
                                            <span style={{ float: "right" }}>
                                              {dayjs(comment.createdAt).format(
                                                "DD/MM/YYYY HH:mm:ss"
                                              )}
                                            </span>
                                          </div>
                                          <div className="rev-content">
                                            <p style={{ paddingLeft: "20px" }}>
                                              {comment.comment}
                                            </p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="form-group row">
                                        <div className="col">
                                          <label
                                            htmlFor="review"
                                            className="col-form-label"
                                          >
                                            Sản phẩm chưa có bình luận
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div
                                    className="form-group row"
                                    style={{ marginTop: "20px" }}
                                  >
                                    <div className="col">
                                      <textarea
                                        className="form-control"
                                        id="review"
                                        placeholder="Bình luận của bạn"
                                        value={textComment}
                                        onChange={(e) =>
                                          handleChangeTextComment(
                                            e.target.value
                                          )
                                        }
                                        rows={3}
                                      />
                                    </div>
                                  </div>

                                  <div className="form-group row">
                                    <div className="col">
                                      <button
                                        className="btn btn-secondary"
                                        style={{
                                          backgroundColor: "#c29957",
                                          width: "100px",
                                          height: "30px",
                                        }}
                                        onClick={() =>
                                          createComment(newComment)
                                        }
                                      >
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
                          <Col
                            key={relatedProduct._id}
                            className="gutter-row"
                            span={6}
                          >
                            <div className="product-item">
                              <figure className="product-thumb">
                                <a href="#">
                                  <img
                                    className="pri-img"
                                    src={relatedProduct?.image?.[0]}
                                    alt="product"
                                  />
                                </a>
                                <div className="product-badge">
                                  <div className="product-label new">
                                    <span>HOT</span>
                                  </div>
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
