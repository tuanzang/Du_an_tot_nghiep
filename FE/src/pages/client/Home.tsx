import { useEffect, useState } from "react";
import { Carousel, Col, Row } from "antd";
import "./Home.css";
import axios from "axios";
import { IProduct } from "../../interface/Products";
import ProductItem from "../../components/ProductItem";
import { socket } from "../../socket";

const contentStyle: React.CSSProperties = {
  height: "530px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export default function Home() {
  // const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const [product, setProduct] = useState<IProduct[]>([]);
  // const { mutate } = useCartMutation({
  //   action: "ADD",
  //   onSuccess: () => {
  //     message.success("Đã thêm sản phẩm vào giỏ hàng");
  //   },
  // });

  useEffect(() => {
    const onHiddenProduct = () => {
      fetchProducts()
    };

    socket.on("hidden product", onHiddenProduct);

    return () => {
      socket.off("hidden product", onHiddenProduct);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products`);
      setProduct(response.data?.data);
    } catch (error) {
      console.log("Khong co du lieu");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const onAddCart = (productData: IProduct) => {
  //   if (!isLogged) {
  //     return message.info("Vui lòng đăng nhập tài khoản!");
  //   }

  //   mutate({
  //     productId: productData._id,
  //     quantity: 1,
  //   });
  // };

  if (!product) return null;

  return (
    <div>
      <main>
        {/* <!-- hero slider area start --> */}
        <section className="slider-area">
          <Carousel autoplay={true} autoplaySpeed={2000}>
            <div>
              <h3 style={contentStyle}>
                <img src="./src/assets/image/slider/home1-slide1.jpg" />
              </h3>
            </div>
            <div>
              <h3 style={contentStyle}>
                <img src="./src/assets/image/slider/home2-slide1.jpg" />
              </h3>
            </div>
            <div>
              <h3 style={contentStyle}>
                <img src="./src/assets/image/slider/home3-slide1.jpg" />
              </h3>
            </div>
          </Carousel>
        </section>
        {/* <!-- hero slider area end --> */}

        {/* <!-- service policy area start --> */}
        <div className="service-policy">
          <div className="container">
            <div className="policy-block section-padding">
              <div className="row mtn-30">
                <div className="col-sm-6 col-lg-3">
                  <div className="policy-item">
                    <div className="policy-content">
                      <h6>Miễn phí ship</h6>
                      <p>Miễn phí ship toàn quốc</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="policy-item">
                    <div className="policy-content">
                      <h6>Hỗ trợ</h6>
                      <p>Hỗ trợ 24h trên ngày</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="policy-item">
                    <div className="policy-content">
                      <h6>Bảo hành</h6>
                      <p>Bảo hành làm mới trong 1 năm</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="policy-item">
                    <div className="policy-content">
                      <h6>Tra cứu đơn hàng</h6>
                      <p>Có thể tra cứu mọi lúc</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- service policy area end --> */}

        {/* <!-- product area start --> */}
        <section className="product-area section-padding">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* <!-- section title start --> */}
                <div className="section-title text-center">
                  <h2 className="title">Sản phẩm bán chạy</h2>
                  <p className="sub-title">
                    Sản phẩm được ưa chuộng nhiều nhất
                  </p>
                </div>
                {/* <!-- section title start --> */}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="product-container">
                  {/* <!-- product tab menu start --> */}
                  <div className="product-tab-menu">
                    <ul className="nav justify-content-center">
                      <li>
                        <a href="#" className="active" data-bs-toggle="tab">
                          Nhẫn
                        </a>
                      </li>
                      <li>
                        <a href="#" data-bs-toggle="tab">
                          Dây chuyền
                        </a>
                      </li>
                      <li>
                        <a href="#" data-bs-toggle="tab">
                          Lắc tay
                        </a>
                      </li>
                      <li>
                        <a href="#" data-bs-toggle="tab">
                          Bông tai
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- product tab menu end --> */}

                  {/* <!-- product tab content start --> */}
                  <div className="tab-content">
                    <Carousel autoplay={true} autoplaySpeed={5000}>
                      {/* <!-- product item start --> */}
                      <div className="tab-pane fade show active">
                        <div className="product-carousel-4 slick-row-10 slick-arrow-style">
                          <Row gutter={16}>
                            {product.map((p: IProduct) => (
                              <Col key={p._id} className="gutter-row" span={6}>
                                <ProductItem data={p} />
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
                            {product.map((p) => (
                              <Col key={p._id} className="gutter-row" span={6}>
                                <ProductItem data={p} />
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
          </div>
        </section>
        {/* <!-- product area end --> */}

        {/* <!-- banner statistics area start --> */}
        <div className="banner-statistics-area">
          <div className="container">
            <div className="row row-20 mtn-20">
              <div className="col-sm-6">
                <figure className="banner-statistics mt-20">
                  <a href="#">
                    <img
                      src="./src/assets/image/banner/img1-top.jpg"
                      alt="product banner"
                    />
                  </a>
                  <div className="banner-content text-right">
                    <h5 className="banner-text1">Nhẫn</h5>
                    <h2 className="banner-text2">
                      Sang<span>Trọng</span>
                    </h2>
                  </div>
                </figure>
              </div>
              <div className="col-sm-6">
                <figure className="banner-statistics mt-20">
                  <a href="#">
                    <img
                      src="./src/assets/image/banner/img2-top.jpg"
                      alt="product banner"
                    />
                  </a>
                  <div className="banner-content text-center">
                    <h5 className="banner-text1">Bông tai</h5>
                    <h2 className="banner-text2">
                      Thanh<span>Lịch</span>
                    </h2>
                  </div>
                </figure>
              </div>
              <div className="col-sm-6">
                <figure className="banner-statistics mt-20">
                  <a href="#">
                    <img
                      src="./src/assets/image/banner/img3-top.jpg"
                      alt="product banner"
                    />
                  </a>
                  <div className="banner-content text-center">
                    <h5 className="banner-text1">Dây chuyền</h5>
                    <h2 className="banner-text2">
                      Quý<span>Phái</span>
                    </h2>
                  </div>
                </figure>
              </div>
              <div className="col-sm-6">
                <figure className="banner-statistics mt-20">
                  <a href="#">
                    <img
                      src="./src/assets/image/banner/img4-top.jpg"
                      alt="product banner"
                    />
                  </a>
                  <div className="banner-content text-right">
                    <h5 className="banner-text1">Lắc tay</h5>
                    <h2 className="banner-text2">
                      Tinh<span>Tế</span>
                    </h2>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- banner statistics area end --> */}

        {/* <!-- latest blog area start --> */}
        <section className="latest-blog-area section-padding pt-0">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* <!-- section title start --> */}
                <div className="section-title text-center">
                  <h2 className="title">Blog mới nhất</h2>
                  <p className="sub-title">Danh sách blog mới nhất</p>
                </div>
                {/* <!-- section title start --> */}
              </div>
            </div>
            <div className="tab-content">
              <Carousel autoplay={true} autoplaySpeed={5000}>
                {/* <!-- product item start --> */}
                <div className="tab-pane fade show active">
                  <div className="blog-carousel-active slick-row-10 slick-arrow-style">
                    <Row gutter={16}>
                      <Col className="gutter-row" span={8}>
                        {/* <!-- blog post item start --> */}
                        <div key={1} className="blog-post-item">
                          <figure className="blog-thumb">
                            <a href="#">
                              <img
                                src="./src/assets/image/blog/blog-img1.jpg"
                                alt="blog image"
                              />
                            </a>
                          </figure>
                          <div className="blog-content">
                            <div className="blog-meta">
                              <p>
                                25/03/2024 | <a href="#">F-Bee</a>
                              </p>
                            </div>
                            <h5 className="blog-title">
                              <a href="#">
                                Con gái người nổi tiếng chia sẻ về việc có mắt
                              </a>
                            </h5>
                          </div>
                        </div>
                        {/* <!-- blog post item end --> */}
                      </Col>
                      <Col className="gutter-row" span={8}>
                        {/* <!-- blog post item start --> */}
                        <div key={2} className="blog-post-item">
                          <figure className="blog-thumb">
                            <a href="#">
                              <img
                                src="./src/assets/image/blog/blog-img2.jpg"
                                alt="blog image"
                              />
                            </a>
                          </figure>
                          <div className="blog-content">
                            <div className="blog-meta">
                              <p>
                                25/04/2024 | <a href="#">F-Bee</a>
                              </p>
                            </div>
                            <h5 className="blog-title">
                              <a href="#">
                                Trẻ em bỏ nhà một mình 4 ngày trong phim truyền
                                hình
                              </a>
                            </h5>
                          </div>
                        </div>
                        {/* <!-- blog post item end --> */}
                      </Col>
                      <Col key={3} className="gutter-row" span={8}>
                        {/* <!-- blog post item start --> */}
                        <div className="blog-post-item">
                          <figure className="blog-thumb">
                            <a href="#">
                              <img
                                src="./src/assets/image/blog/blog-img3.jpg"
                                alt="blog image"
                              />
                            </a>
                          </figure>
                          <div className="blog-content">
                            <div className="blog-meta">
                              <p>
                                25/05/2024 | <a href="#">F-Bee</a>
                              </p>
                            </div>
                            <h5 className="blog-title">
                              <a href="#">
                                Người trúng xổ số tặng tiền cho bất kỳ người đàn
                                ông nào
                              </a>
                            </h5>
                          </div>
                        </div>
                        {/* <!-- blog post item end --> */}
                      </Col>
                    </Row>
                  </div>
                </div>
                {/* <!-- product item end --> */}
                {/* <!-- product item start --> */}
                <div className="tab-pane fade show active">
                  <div className="blog-carousel-active slick-row-10 slick-arrow-style">
                    <Row gutter={16}>
                      <Col className="gutter-row" span={8}>
                        {/* <!-- blog post item start --> */}
                        <div className="blog-post-item">
                          <figure className="blog-thumb">
                            <a href="#">
                              <img
                                src="./src/assets/image/blog/blog-img3.jpg"
                                alt="blog image"
                              />
                            </a>
                          </figure>
                          <div className="blog-content">
                            <div className="blog-meta">
                              <p>
                                25/06/2024 | <a href="#">F-Bee</a>
                              </p>
                            </div>
                            <h5 className="blog-title">
                              <a href="#">
                                Người trúng xổ số tặng tiền cho bất kỳ người đàn
                                ông nào
                              </a>
                            </h5>
                          </div>
                        </div>
                        {/* <!-- blog post item end --> */}
                      </Col>
                      <Col className="gutter-row" span={8}>
                        {/* <!-- blog post item start --> */}
                        <div className="blog-post-item">
                          <figure className="blog-thumb">
                            <a href="#">
                              <img
                                src="./src/assets/image/blog/blog-img4.jpg"
                                alt="blog image"
                              />
                            </a>
                          </figure>
                          <div className="blog-content">
                            <div className="blog-meta">
                              <p>
                                25/07/2024 | <a href="#">F-Bee</a>
                              </p>
                            </div>
                            <h5 className="blog-title">
                              <a href="#">
                                Mọi người sẵn sàng nói dối khi có tiền
                              </a>
                            </h5>
                          </div>
                        </div>
                        {/* <!-- blog post item end --> */}
                      </Col>
                      <Col className="gutter-row" span={8}>
                        {/* <!-- blog post item start --> */}
                        <div className="blog-post-item">
                          <figure className="blog-thumb">
                            <a href="#">
                              <img
                                src="./src/assets/image/blog/blog-img5.jpg"
                                alt="blog image"
                              />
                            </a>
                          </figure>
                          <div className="blog-content">
                            <div className="blog-meta">
                              <p>
                                25/08/2024 | <a href="#">F-Bee</a>
                              </p>
                            </div>
                            <h5 className="blog-title">
                              <a href="#">
                                Chuyện tình lãng mạn lớn nhất Hollywood
                              </a>
                            </h5>
                          </div>
                        </div>
                        {/* <!-- blog post item end --> */}
                      </Col>
                    </Row>
                  </div>
                </div>
                {/* <!-- product item end --> */}
              </Carousel>
            </div>
          </div>
        </section>
        {/* <!-- latest blog area end --> */}
      </main>
    </div>
  );
}
