import React from "react";

const Footer = () => {
  return (
    <div>
      {/* footer area start */}
      <footer className="footer-widget-area">
        <div className="footer-top section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="widget-item">
                  <div className="widget-title">
                    <div className="widget-logo">
                      <a href="index.html">
                        <img
                          src="../src/assets/image/logo/logo.png"
                          alt="brand logo"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="widget-body">
                    <p>Website bán đồ trang sức F-Bee</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="widget-item">
                  <h6 className="widget-title">Liên hệ</h6>
                  <div className="widget-body">
                    <address className="contact-block">
                      <ul>
                        <li>
                          <i className="pe-7s-home"></i>
                          Cao Đẳng FPT Polytechnic
                        </li>
                        <li>
                          <i className="pe-7s-mail"></i>
                          <a href="mailto:demo@plazathemes.com">
                            fbee@gmail.com
                          </a>
                        </li>
                        <li>
                          <i className="pe-7s-call"></i>
                          <a href="tel:(012)800456789987">(+84) 123 xxx 123</a>
                        </li>
                      </ul>
                    </address>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="widget-item">
                  <h6 className="widget-title">Thông tin</h6>
                  <div className="widget-body">
                    <ul className="info-list">
                      <li>
                        <a href="#">Tin tức</a>
                      </li>
                      <li>
                        <a href="#">Tra cứu đơn hàng</a>
                      </li>
                      <li>
                        <a href="#">Sản phẩm</a>
                      </li>
                      <li>
                        <a href="#">Chính sách</a>
                      </li>
                      <li>
                        <a href="#">Liên hệ</a>
                      </li>
                      <li>
                        <a href="#">Địa chỉ</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="widget-item">
                  <h6 className="widget-title">Theo dõi</h6>
                  <div className="widget-body social-link">
                    <a href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="fa fa-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fa fa-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="fa fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center mt-20">
              <div className="col-md-6">
                <div className="newsletter-wrapper">
                  <h6 className="widget-title-text">
                    Đăng ký để nhận thêm thông tin
                  </h6>
                  <form className="newsletter-inner" id="mc-form">
                    <input
                      type="email"
                      className="news-field"
                      id="mc-email"
                      autoComplete="off"
                      placeholder="Nhập email của bạn"
                    />
                    <button className="news-btn" id="mc-submit">
                      Đăng ký
                    </button>
                  </form>
                  {/* mail-chimp-alerts Start */}
                  <div className="mailchimp-alerts">
                    <div className="mailchimp-submitting"></div>
                    {/* mail-chimp-submitting end */}
                    <div className="mailchimp-success"></div>
                    {/* mail-chimp-success end */}
                    <div className="mailchimp-error"></div>
                    {/* mail-chimp-error end */}
                  </div>
                  {/* mail-chimp-alerts end */}
                </div>
              </div>
              <div className="col-md-6">
                <div className="footer-payment">
                  <img
                    src="./src/assets/image/payment.png"
                    alt="payment method"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="copyright-text text-center">
                  <p>
                    &copy; 2024 <b>F-Bee</b> Made with
                    <i className="fa fa-heart text-danger"></i>
                    <a href="https://hasthemes.com/">
                      <b>Mã nhóm</b>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* footer area end */}
    </div>
  );
};

export default Footer;
