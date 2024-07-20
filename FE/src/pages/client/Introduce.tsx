import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import "./Introduce.css";

const AccountInfo = () => {
  const [name, setName] = useState("Nguyễn văn A");
  const [email, setEmail] = useState("nguyenvan@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [address, setAddress] = useState("123 Đường ABC, Quận XYZ, TP. Hà Nội");

  const handleSave = () => {
    // Thực hiện lưu thông tin cập nhật
    console.log({ name, email, phone, address });
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
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số Điện Thoại</label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Địa Chỉ Nhận Hàng</label>
              <input
                type="text"
                id="address"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
              Lưu Thay Đổi
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
