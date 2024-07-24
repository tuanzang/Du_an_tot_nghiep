import { useState, ChangeEvent } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import "./Introduce.css"; // Đảm bảo rằng đường dẫn đúng với vị trí của file CSS

// Dữ liệu mẫu cho các lựa chọn
const cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Nha Trang"];

// Khai báo kiểu cho districts và wards
interface Districts {
  [key: string]: string[];
}

interface Wards {
  [key: string]: string[];
}

const districts: Districts = {
  "Hà Nội": ["Hoàn Kiếm", "Đống Đa", "Cầu Giấy", "Tây Hồ"],
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Tân Bình"],
  "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Thanh Khê", "Liên Chiểu"],
  // Thêm các tỉnh thành và quận huyện khác
};

const wards: Wards = {
  "Hoàn Kiếm": ["Cửa Nam", "Hàng Bông", "Hàng Đào"],
  "Đống Đa": ["Khâm Thiên", "Nam Đồng", "Thịnh Quang"],
  "Quận 1": ["Bến Nghé", "Bến Thành", "Nguyễn Thái Bình"],
  "Quận 3": ["Võ Thị Sáu", "Tân Định", "Cao Thắng"],
  // Thêm các quận huyện và xã phường khác
};

const AccountInfo = () => {
  const [name, setName] = useState("Nguyễn văn A");
  const [email, setEmail] = useState("nguyenvan@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("123 Đường ABC");

  const handleSave = () => {
    // Thực hiện lưu thông tin cập nhật
    console.log({ name, email, phone, city, district, ward, specificAddress });
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setDistrict(""); // Reset quận/huyện khi thay đổi tỉnh/thành phố
    setWard(""); // Reset xã/phường khi thay đổi quận/huyện
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setWard(""); // Reset xã/phường khi thay đổi quận/huyện
  };

  return (
    <div className="container mt-5">
      <h3 className="account-header mb-4">Thông Tin Tài Khoản Của Tôi</h3>
      <div className="row">
        {/* Cột bên trái */}
        <div className="col-md-4">
          <nav className="nav flex-column">
            <a href="/order_history" className="nav-link">
              Đơn Hàng Của Tôi
            </a>
            <a href="/changePass" className="nav-link">
              Đổi Mật Khẩu
            </a>
            <a href="#logout" className="nav-link">
              <FaSignOutAlt /> Đăng Xuất
            </a>
          </nav>
        </div>
        {/* Cột bên phải */}
        <div className="col-md-8">
          <div className="account-info">
            <div className="form-group">
              <label htmlFor="name">Tên Khách Hàng</label>
              <input
                type="text"
                id="name"
                className="form-control input-sm"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className="row row-info">
              <div className="col-info">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control input-sm"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="col-info">
                <div className="form-group">
                  <label htmlFor="phone">Số Điện Thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control input-sm"
                    value={phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPhone(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row row-info">
              <div className="col-info">
                <div className="form-group">
                  <label htmlFor="city">Thành Phố/Tỉnh</label>
                  <select
                    id="city"
                    className="form-control select-custom input-sm"
                    value={city}
                    onChange={handleCityChange}
                  >
                    <option value="">Chọn Thành Phố/Tỉnh</option>
                    {cities.map((cityOption, index) => (
                      <option key={index} value={cityOption}>
                        {cityOption}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-info">
                <div className="form-group">
                  <label htmlFor="district">Quận/Huyện</label>
                  <select
                    id="district"
                    className="form-control select-custom input-sm"
                    value={district}
                    onChange={handleDistrictChange}
                    disabled={!city} // Disable khi chưa chọn tỉnh/thành phố
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {city &&
                      districts[city] &&
                      districts[city].map((districtOption, index) => (
                        <option key={index} value={districtOption}>
                          {districtOption}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-info">
                <div className="form-group">
                  <label htmlFor="ward">Xã/Phường</label>
                  <select
                    id="ward"
                    className="form-control select-custom input-sm"
                    value={ward}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setWard(e.target.value)
                    }
                    disabled={!district} // Disable khi chưa chọn quận/huyện
                  >
                    <option value="">Chọn Xã/Phường</option>
                    {district &&
                      wards[district] &&
                      wards[district].map((wardOption, index) => (
                        <option key={index} value={wardOption}>
                          {wardOption}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="specificAddress">Địa Chỉ Cụ Thể</label>
              <input
                type="text"
                id="specificAddress"
                className="form-control input-sm"
                value={specificAddress}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSpecificAddress(e.target.value)
                }
              />
            </div>
            <button className="btn btn-update" onClick={handleSave}>
              Cập Nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AccountInfo />
    </div>
  );
}

export default App;
