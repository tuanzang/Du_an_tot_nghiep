import React, { useState } from "react";

const Header = () => {
  const [openMenuCart, setOpenMenuCart] = useState(false);
  const handleMenuCartClick = () => {
    setOpenMenuCart(!openMenuCart);
  };
  return (
    <div>
      <header className="header-area header-wide bg-gray">
        {/* main header start */}
        <div className="main-header d-none d-lg-block">
          {/* header top start */}
          <div className="header-top bdr-bottom">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="welcome-message">
                    <p>Chào mừng bạn đến với F-Bee</p>
                  </div>
                </div>
                <div className="col-lg-6 text-right">
                  <div className="header-top-settings">
                    <ul className="nav align-items-center justify-content-end">
                      <li className="curreny-wrap">
                        Cao Đẳng FPT Polytechnic Hà Nội
                      </li>
                      <li className="language">
                        <img src="../src/assets/image/icon/vn.gif" alt="flag" />
                        Việt Nam
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* header top end */}

          {/* header middle area start */}
          <div className="header-main-area sticky">
            <div className="container">
              <div className="row align-items-center position-relative">
                {/* start logo area */}
                <div className="col-lg-2">
                  <div className="logo" style={{ width: "50%" }}>
                    <a href="/home">
                      <img
                        src="../src/assets/image/logo/logo.png"
                        alt="brand logo"
                      />
                    </a>
                  </div>
                </div>
                {/* start logo area */}

                {/* main menu area start */}
                <div className="col-lg-6 position-static">
                  <div className="main-menu-area">
                    <div className="main-menu">
                      {/* main menu navbar start */}
                      <nav className="desktop-menu">
                        <ul>
                          <li>
                            <a href="/home">Home</a>
                          </li>
                          <li>
                            <a href="/product">Sản phẩm</a>
                          </li>
                          <li>
                            <a href="shop.html">Tin tức</a>
                          </li>
                          <li>
                            <a href="shop.html">Về chúng tôi</a>
                          </li>
                          <li>
                            <a href="contact-us.html">Tra cứu đơn hàng</a>
                          </li>
                        </ul>
                      </nav>
                      {/* main menu navbar end */}
                    </div>
                  </div>
                </div>
                {/* main menu area end */}

                {/* mini cart area start */}
                <div className="col-lg-4">
                  <div className="header-right d-flex align-items-center justify-content-xl-between justify-content-lg-end">
                    <div className="header-search-container">
                      <button className="search-trigger d-xl-none d-lg-block">
                        <i className="pe-7s-search"></i>
                      </button>
                      <form className="header-search-box d-lg-none d-xl-block">
                        <input
                          type="text"
                          placeholder="Tìm kiếm"
                          className="header-search-field bg-white"
                        />
                        <button className="header-search-btn">
                          <i className="pe-7s-search"></i>
                        </button>
                      </form>
                    </div>
                    <div className="header-configure-area">
                      <ul className="nav justify-content-end">
                        <li className="user-hover">
                          <a href="#">
                            <i className="pe-7s-user"></i>
                          </a>
                          <ul className="dropdown-list">
                            <li>
                              <a href="login-register.html">Đăng nhập</a>
                            </li>
                            <li>
                              <a href="login-register.html">Đăng ký</a>
                            </li>
                            <li>
                              <a href="my-account.html">Tài khoản của tôi</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="wishlist.html">
                            <i className="pe-7s-like"></i>
                            <div className="notification">0</div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/cart"
                            className="minicart-btn"
                            onClick={() => handleMenuCartClick()}
                          >
                            <i className="pe-7s-shopbag"></i>
                            <div className="notification">2</div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* mini cart area end */}
              </div>
            </div>
          </div>
          {/* header middle area end */}
        </div>
        {/* main header start */}

        {/* mobile header start */}
        <div className="mobile-header d-lg-none d-md-block sticky">
          {/* mobile header top start */}
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-12">
                <div className="mobile-main-header">
                  <div className="mobile-logo">
                    <a href="./index.html">
                      <img
                        src="./src/assets/image/logo/logo.png"
                        alt="Brand Logo"
                      />
                    </a>
                  </div>
                  <div className="mobile-menu-toggler">
                    <div className="mini-cart-wrap">
                      <a href="cart.html">
                        <i className="pe-7s-shopbag"></i>
                        <div className="notification">0</div>
                      </a>
                    </div>
                    <button className="mobile-menu-btn">
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* mobile header top end */}
        </div>
        {/* mobile header end */}

        {/* offcanvas mobile menu start */}
        <aside className="off-canvas-wrapper">
          <div className="off-canvas-overlay"></div>
          <div className="off-canvas-inner-content">
            <div className="btn-close-off-canvas">
              <i className="pe-7s-close"></i>
            </div>

            <div className="off-canvas-inner">
              {/* search box start */}
              <div className="search-box-offcanvas">
                <form>
                  <input type="text" placeholder="Search Here..." />
                  <button className="search-btn">
                    <i className="pe-7s-search"></i>
                  </button>
                </form>
              </div>
              {/* search box end */}

              {/* mobile menu start */}
              <div className="mobile-navigation">
                <nav>
                  <ul className="mobile-menu">
                    <li className="menu-item-has-children">
                      <a href="/home">Home</a>
                    </li>
                    <li className="menu-item-has-children">
                      <a href="/product">Sản phẩm</a>
                    </li>
                    <li className="menu-item-has-children">
                      <a href="shop.html">Tin tức</a>
                    </li>
                    <li className="menu-item-has-children">
                      <a href="shop.html">Về chúng tôi</a>
                    </li>
                    <li>
                      <a href="contact-us.html">Tra cứu đơn hàng</a>
                    </li>
                  </ul>
                </nav>
              </div>
              {/* mobile menu end */}

              <div className="mobile-settings">
                <ul className="nav">
                  <li>
                    <div className="dropdown mobile-top-dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle"
                        id="currency"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Cao Đẳng FPT Polytechnic
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown mobile-top-dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle"
                        id="myaccount"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Thông tin tài khoản
                        <i className="fa fa-angle-down"></i>
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="myaccount"
                      >
                        <a className="dropdown-item" href="my-account.html">
                          Tài khoản của tôi
                        </a>
                        <a className="dropdown-item" href="login-register.html">
                          Đăng ký
                        </a>
                        <a className="dropdown-item" href="login-register.html">
                          Đăng nhập
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* offcanvas widget area start */}
              <div className="offcanvas-widget-area">
                <div className="off-canvas-contact-widget">
                  <ul>
                    <li>
                      <i className="fa fa-mobile"></i>
                      <a href="#">0123456789</a>
                    </li>
                    <li>
                      <i className="fa fa-envelope-o"></i>
                      <a href="#">info@yourdomain.com</a>
                    </li>
                  </ul>
                </div>
                <div className="off-canvas-social-widget">
                  <a href="#">
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-pinterest-p"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-linkedin"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-youtube-play"></i>
                  </a>
                </div>
              </div>
              {/* offcanvas widget area end */}
            </div>
          </div>
        </aside>
        {/* offcanvas mobile menu end */}

        {openMenuCart && <div>a</div>}
      </header>
    </div>
  );
};

export default Header;