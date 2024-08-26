import { Carousel, Col, Image, Row, message, Button, Rate, Avatar } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IProduct } from "../../interface/Products";
import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY } from "../../services/constants";
import useCartMutation from "../../hooks/useCart";
import dayjs from "dayjs";
import { IComment } from "../../interface/Comments";
import "react-toastify/dist/ReactToastify.css";
import { IProductSize } from "../../interface/ProductSize";
import ProductItem from "../../components/ProductItem";
import { formatPrice } from "../../utils";
import { IOption } from "../../interface/Option";
import { socket } from "../../socket";

export default function ProductDetail() {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL params
  const [product, setProduct] = useState<IProduct>();
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [selectedSize, setSelectedSize] = useState<IProductSize | null>();
  const [productSizes, setProductSizes] = useState<IProductSize[]>([]);
  const [optionSelected, setOptionSelected] = useState<IOption | null>();
  const [optionImageSelected, setOptionImageSelected] = useState<IOption | null>();
  const [productImage, setProductImage] = useState<string>();

  // product price
  const productPrice = useMemo(() => {
    if (selectedSize) {
      if (optionSelected?.price) {
        return formatPrice(selectedSize?.price + optionSelected.price)
      }
      return formatPrice(selectedSize?.price);
    }

    const productSizePrices = product?.productSizedata?.map((it) => it.price) || [];

    const nonZeroPrices = productSizePrices.filter(price => price > 0).sort((a, b) => a - b);
    const minPrice = nonZeroPrices[0];
    const secondMinPrice = nonZeroPrices[1] || minPrice;

    return `${formatPrice(minPrice === 0 ? secondMinPrice : minPrice)} - ${formatPrice(Math.max(...productSizePrices))}`;
  }, [selectedSize, product, optionSelected]);

  // lấy token đăng nhập
  const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const { mutate } = useCartMutation({
    action: "ADD",
    onSuccess: () => {
      message.success("Đã thêm sản phẩm vào giỏ hàng");
      setQuantity(1);
      setSelectedSize(null);
      setOptionSelected(null);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại')
    }
  });

  useEffect(() => {
    fetchProduct(String(id));
    fetchRelatedProducts();
    fetchComment(String(id));
  }, [id]);

  const fetchProduct = async (id: string) => {
    try {
      if (id) {
        const response = await axios.get(
          `http://localhost:3001/api/products/${id}`
        );
        const productData = response.data.data;
        setProduct(productData);
        setProductImage(productData?.image?.[0])
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

  // Gọi API để lấy số lượng sản phẩm theo kích cỡ
  const fetchProductSizes = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/products/productSize/${id}`
      );
      setProductSizes(data.data);
    } catch (error) {
      console.error("Error fetching product sizes:", error);
    }
  };

  useEffect(() => {
    fetchProductSizes();
  }, [id]);

  // listen hidden product size
  useEffect(() => {
    const onProductUpdate = (productId: string) => {
      if (productId === id) {
        fetchProductSizes();
      }
    }

    const onHiddenProduct = (productId: string) => {
      productId === id && fetchProduct(id)
    }

    const onOptionUpdate = (productId: string) => {
      id === productId && fetchProduct(id);
    }

    socket.on('update product', onProductUpdate);

    // listen hidden product
    socket.on('hidden product', onHiddenProduct)

    // listen update product option
    socket.on('option update', onOptionUpdate)

    return () => {
      socket.off('update product', onProductUpdate);
      socket.off('hidden product', onHiddenProduct);
      socket.off('option update', onOptionUpdate);
    }
  }, [id]);

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

  const onAddCart = () => {
    if (!isLogged) {
      return message.info("Vui lòng đăng nhập tài khoản!");
    }

    if (!selectedSize) {
      return message.info("Vui lòng chọn size!");
    }

    if (quantity > selectedSize.quantity) {
      return message.info("Vượt quá số lượng sản phẩm còn trong kho");
    }

    if (optionSelected && quantity > optionSelected.quantity) {
      return message.info("Không đủ số lượng option!");
    }

    const body = {
      productId: product?._id,
      quantity,
      variantId: selectedSize._id,
    };

    if (optionSelected) {
      body.option = optionSelected._id;
    }

    mutate(body);
  };

  /** API bình luận sản phẩm */
  const [listComment, setListComment] = useState<IComment[]>([]);
  const [averageRate, setAvarageRate] = useState<number>(0);
  const fetchComment = async (idProduct: string | null) => {
    if (idProduct === null) {
      return setListComment([]);
      setAvarageRate(0);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/comments/findByIdProduct",
          {
            idProduct: idProduct,
          }
        );

        const data = response.data?.data || [];
        setListComment(data);

        if (data.length > 0) {
          const avgRate =
            data.reduce(
              (total: number, comment: IComment) => total + comment.rate,
              0
            ) / data.length;
          setAvarageRate(avgRate);
        } else {
          setAvarageRate(0);
        }
      } catch (error) {
        console.log("Không có dữ liệu");
      }
    }
  };

  const handleSizeClick = (sizeId: string | null) => {
    const findSize = productSizes.find((it) => it._id === sizeId);
    setSelectedSize(findSize);
  };

  const onOptionClick = (option?: IOption) => {
    setOptionSelected(option);

    if (option) {
      setProductImage(option?.image);
    } else {
      setProductImage(product?.image?.[0]);
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
                          src={productImage}
                          alt="product-details"
                          className={!product?.status ? "grayscale" : ""}
                        />
                      </div>

                      <div className="option-images">
                        {product?.options?.map(it => (
                          <div
                            key={`option-image-${it._id}`}
                            className={`option-image ${optionImageSelected?._id === it._id && 'selected'}`}
                            onClick={() => {
                              setOptionImageSelected(it);
                              setProductImage(it?.image);
                            }}
                          >
                            <img src={it.image} alt="Option img" />
                          </div>
                        ))}
                      </div>
                      <div className="tab-content"></div>
                    </div>
                    <div className="col-lg-7">
                      <div className="product-details-des">
                        <h3
                          className="product-name"
                          style={{ fontWeight: "300", fontSize: "30px" }}
                        >
                          {product?.name}
                          <Rate
                            style={{
                              float: "right",
                            }}
                            allowHalf
                            value={averageRate}
                            disabled
                          />
                        </h3>

                        {!product?.status && <p className="status-red">Tạm ngừng kinh doanh</p>}

                        <div className="price-box">
                          <span
                            className="price-regular"
                            style={{ color: "red", fontSize: "20px" }}
                          >
                            {productPrice} VNĐ
                          </span>
                        </div>
                        <div>
                          <div className="button-container mt-2">
                            <p>Kích cỡ:</p>
                            {productSizes.map((size) => (
                              <Button
                                key={size._id}
                                className={`mx-1 ${selectedSize?._id === size._id
                                  ? "selected"
                                  : ""
                                  }`}
                                disabled={!size.status}
                                style={{
                                  padding: "10px 20px",
                                  fontSize: "16px",
                                  opacity: size.quantity === 0 ? 0.5 : 1,
                                  cursor: size.quantity === 0 ? "not-allowed" : "pointer"
                                }}
                                onClick={() => size.quantity > 0 && handleSizeClick(size._id)}
                              >
                                {size.sizeName}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {selectedSize && (
                          <div
                            className="mt-2"
                            style={{ color: "black", fontSize: "15px" }}
                          >
                            <p>Sản phẩm hiện có: {selectedSize?.quantity}</p>
                          </div>
                        )}

                        <div>
                          <div className="button-container mt-4">
                            <p>Phụ kiện:</p>
                            <Button onClick={() => onOptionClick()} className="mx-1" type={!optionSelected ? 'primary' : 'default'}>
                              Không 
                            </Button>

                            {product?.options.map((item) => {
                              const isDisable = item.quantity === 0 || !item.status;

                              return <Button
                                key={item._id}
                                className={`mx-1`}
                                type={optionSelected?._id === item._id ? 'primary' : 'default'}
                                style={{
                                  padding: "10px 20px",
                                  fontSize: "16px",
                                  opacity: isDisable ? 0.5 : 1,
                                  cursor: isDisable ? "not-allowed" : "pointer"
                                }}
                                onClick={() => !isDisable && onOptionClick(item)}
                              >
                                {item.name}
                              </Button>
                            })}
                          </div>
                        </div>

                        {optionSelected && (
                          <div
                            className="mt-2"
                            style={{ color: "black", fontSize: "15px" }}
                          >
                            <p>Sản phẩm hiện có: {optionSelected?.quantity}</p>
                          </div>
                        )}

                        <div className="quantity-cart-box d-flex align-items-center pt-5">
                          <h6 className="option-title">Số lượng:</h6>
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={handleQuantityDecrease}
                            >
                              -
                            </button>
                            <input
                              // type="number"
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
                                onClick={onAddCart}
                                disabled={!product?.status}
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
                              marginBottom: "10px",
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
                                Hướng dẫn
                              </a>
                            </li>
                            <li>
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
                                <div className="reviews">
                                  <div
                                    className="review-content"
                                    style={{
                                      maxHeight: "310px",
                                      overflowY: "scroll", // Cho phép cuộn nội dung theo chiều dọc
                                      scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
                                      msOverflowStyle: "none", // Ẩn thanh cuộn trên IE và Edge
                                    }}
                                  >
                                    <hr />
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: product?.description || "",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div id="tab_two" className="tab-pane fade">
                              <div className="product-tab-content">
                                <div
                                  className="reviews"
                                  style={{
                                    maxHeight: "400px",
                                    overflowY: "scroll", // Cho phép cuộn nội dung theo chiều dọc
                                    scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
                                    msOverflowStyle: "none", // Ẩn thanh cuộn trên IE và Edge
                                  }}
                                >
                                  <div className="review-content">
                                    <hr />
                                    <h3 className="product-tab-title">
                                      Hướng dẫn đo size nhẫn
                                    </h3>
                                    <ul>
                                      <li>
                                        <img
                                          src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/451834400_1143488730215335_8162184727999743406_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=A3J78wJhMkcQ7kNvgHH0Lvb&_nc_ht=scontent.fhan17-1.fna&oh=00_AYD4m8sTtmS14USujkQ3BA48rTU7FtPSsapkyyP3wl1duw&oe=669F95A7"
                                          alt=""
                                          width={"70%"}
                                        />
                                      </li>
                                      <hr />
                                      <li>
                                        <h3>
                                          Những cách đơn giản nhất để đo nhẫn:
                                        </h3>
                                        <h5>Đo bằng tờ giấy và thước</h5>
                                        <span style={{ fontSize: "20px" }}>
                                          Bước 1: Chuẩn bị một cây thước, 1 cây
                                          kéo, 1 cây bút & một tờ giấy <br />{" "}
                                          Bước 2: Cắt một mảnh giấy dài khoảng
                                          10 cm và rộng 1 cm. <br />
                                          Bước 3: Sử dụng đoạn giấy vừa cắt để
                                          quấn sát quanh ngón tay muốn đo.{" "}
                                          <br /> Bước 4: Đánh dấu điểm giao
                                          nhau. <br /> Bước 5: Tháo ra dùng
                                          thước đo chiều dài của đoạn giấy từ
                                          điểm đầu cho đến phần đánh dấu. Lấy
                                          kết quả đo được chia cho 3,14. Sau đó
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
                                          Bước 1: Chuẩn bị một cây thước cùng
                                          chiếc nhẫn muốn đo. <br /> Bước 2: Đối
                                          chiếu số mm của thước với kích thước
                                          trên BẢNG SIZE NHẪN bên trên.
                                        </span>
                                        <img
                                          src="https://www.pnj.com.vn/blog/wp-content/uploads/2021/11/huong-dan-do-size-nhan-3.jpg"
                                          alt=""
                                        />
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div id="tab_three" className="tab-pane fade">
                              <div className="product-tab-content">
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
                                      <div className="review-content">
                                        <hr />
                                        <div
                                          className="row"
                                          key={comment._id}
                                          style={{ marginTop: "0px" }}
                                        >
                                          <div className="col-lg-1">
                                            <Avatar
                                              size={64}
                                              src={comment.avatar}
                                            />
                                          </div>
                                          <div
                                            className="col-lg-9"
                                            style={{
                                              alignItems: "center",
                                              display: "flex",
                                            }}
                                          >
                                            <span>
                                              {comment.fullName}
                                              <Rate
                                                style={{ marginLeft: "10px" }}
                                                allowHalf
                                                value={comment.rate}
                                                disabled
                                              />
                                            </span>
                                          </div>
                                          <div
                                            className="col-lg-2"
                                            style={{
                                              alignItems: "center",
                                              display: "flex",
                                              float: "right",
                                            }}
                                          >
                                            <span>
                                              {dayjs(comment.createdAt).format(
                                                "DD/MM/YYYY HH:mm:ss"
                                              )}
                                            </span>
                                          </div>
                                          <div className="col-lg-1"></div>
                                          <div className="col-lg-11">
                                            <div className="rev-content">
                                              <p>{comment.comment}</p>
                                            </div>
                                          </div>
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
                    {/* <p className="sub-title">Sản phẩm liên quan</p> */}
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
                            <ProductItem data={relatedProduct} />
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
