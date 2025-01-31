import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_INFO_STORAGE_KEY,
} from "../../services/constants";
import { useMyCartQuery } from "../../hooks/useCart";
import { IProduct } from "../../interface/Products";
import axios from "axios";
import { AutoComplete, Input, Spin } from "antd";

interface optionSearch {
  label: string;
  value: string;
  image: string; // Thêm trường image
}

const Header = () => {
  const navigate = useNavigate();
  const [openMenuCart, setOpenMenuCart] = useState(false);
  const { data } = useMyCartQuery();

  const handleMenuCartClick = () => {
    setOpenMenuCart(!openMenuCart);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
  };
  const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const userInfo =
    JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY) as string) || "";

  const [optionsSearch, setOptionsSearch] = useState<optionSearch[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [textSearch, setTextSearch] = useState<string>("");

  const handleSearchProduct = async (textSearch: string) => {
    try {
      setLoadingSearch(true);
      if (textSearch !== "") {
        const response = await axios.post(
          `http://localhost:3001/api/products/search`,
          { name: textSearch }
        );
        const productData = response.data?.data;
        if (productData.length > 0) {
          setOptionsSearch(
            productData.map((p: IProduct) => ({
              label: p.name,
              value: p._id,
              image: p.image[0], // Giả sử image là mảng và lấy ảnh đầu tiên
            }))
          );
        } else {
          setOptionsSearch([{ label: "Không tìm thấy sảm phẩm", value: "", image: ""}]);
        }
      } else {
        setOptionsSearch([]);
      }
      setLoadingSearch(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoadingSearch(false);
    }
  };

  const handleSelect = (option: optionSearch) => {
    if (option.value !== "") {
      navigate(`/product/${option.value}`);
      setTextSearch("");
    }
  };

  useEffect(() => {
    handleSearchProduct(textSearch);
  }, [textSearch]);

  return (
    <div>
      <header className="header-area header-wide bg-gray">
        {/* main header start */}
        <div className="main-header d-none d-lg-block">
          {/* header middle area start */}
          <div className="header-main-area sticky">
            <div className="container">
              <div className="row align-items-center position-relative">
                {/* start logo area */}
                <div className="col-lg-2">
                  <div className="logo" style={{ width: "50%" }}>
                    <Link to="/home">
                      <img
                        src="../../src/assets/image/logo/logo.png"
                        alt="brand logo"
                      />
                    </Link>
                  </div>
                </div>
                {/* start logo area */}

                {/* main menu area start */}
                <div className="col-lg-5 position-static">
                  <div className="main-menu-area">
                    <div className="main-menu">
                      {/* main menu navbar start */}
                      <nav className="desktop-menu">
                        <ul>
                          <li>
                            <NavLink to="/home">Trang chủ</NavLink>
                          </li>
                          <li>
                            <NavLink to="/product">Sản phẩm</NavLink>
                          </li>
                          <li>
                            <NavLink to="/blog">Tin tức</NavLink>
                          </li>
                          <li>
                            <NavLink to="shop.html">Giới thiệu</NavLink>
                          </li>
                          <li>
                            <NavLink to="contact-us.html">Chính sách</NavLink>
                          </li>
                        </ul>
                      </nav>
                      {/* main menu navbar end */}
                    </div>
                  </div>
                </div>
                {/* main menu area end */}

                {/* mini cart area start */}
                <div className="col-lg-5">
                  <div className="header-right d-flex align-items-center justify-content-xl-between justify-content-lg-end">
                    <div className="header-search-container">
                      <Spin spinning={loadingSearch}>
                        <AutoComplete
                          options={optionsSearch.map((option) => ({
                            label: (
                              <div className="autocomplete-option">
                                <img
                                  src={option.image}
                                  alt={option.label}
                                  style={{ width: 50, marginRight: 10}}
                                />
                                <span>{option.label}</span>
                              </div>
                            ),
                            value: option.value,
                          }))}
                          onSelect={(_, option: optionSearch) =>
                            handleSelect(option)
                          }
                          value={textSearch}
                          style={{ width: 300 , marginLeft: 20 }}
                        >
                          <Input.Search
                            placeholder="Tìm kiếm sản phẩm"
                            onChange={(e) => setTextSearch(e.target.value)}
                          />
                        </AutoComplete>
                      </Spin>
                    </div>
                    <div className="header-configure-area">
                      <ul className="nav justify-content-end">
                        <li className="user-hover">
                          <div className="user-info">
                            <i className="pe-7s-user"></i>

                            {isLogged && <p>{userInfo?.name}</p>}
                          </div>
                          <ul className="dropdown-list">
                            {isLogged ? (
                              <>
                                <li>
                                  <a href="/profile">Tài khoản của tôi</a>
                                </li>
                                {userInfo?.role === "admin" && (
                                  <li>
                                    <Link to="/admin">Truy cập Admin</Link>
                                  </li>
                                )}
                                <li>
                                  <a href="" onClick={handleLogout}>
                                    Đăng xuất
                                  </a>
                                </li>
                              </>
                            ) : (
                              <>
                                <li>
                                  <Link to="/login">Đăng nhập</Link>
                                </li>
                                <li>
                                  <Link to="/register">Đăng ký</Link>
                                </li>
                              </>
                            )}
                          </ul>
                        </li>

                        <li>
                          <Link
                            to="/cart"
                            className="minicart-btn"
                            onClick={() => handleMenuCartClick()}
                          >
                            <i className="pe-7s-shopbag"></i>
                            <div className="notification">
                              {data?.data?.products?.length || 0}
                            </div>
                          </Link>
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
                      <a href="/news">Tin tức</a>
                    </li>
                    <li className="menu-item-has-children">
                      <a href="/about">Giới thiệu</a>
                    </li>
                    <li className="menu-item-has-children">
                      <a href="/policy">Chính sách</a>
                    </li>
                    <li className="menu-item-has-children">
                      <a href="/contact">Liên hệ</a>
                    </li>
                  </ul>
                </nav>
              </div>
              {/* mobile menu end */}
            </div>
          </div>
        </aside>
        {/* offcanvas mobile menu end */}
      </header>
    </div>
  );
};

export default Header;
