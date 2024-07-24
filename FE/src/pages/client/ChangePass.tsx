import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSignOutAlt } from "react-icons/fa";
import "./ChangePass.css";
import { Link } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      // Thực hiện thay đổi mật khẩu
      console.log("Thay đổi mật khẩu:", { currentPassword, newPassword });
    } else {
      alert("Mật khẩu mới và mật khẩu xác nhận không khớp.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="account-header mb-4">Đổi Mật Khẩu</h3>
      <div className="row">
        {/* Cột bên trái */}
        <div className="col-md-4">
          <nav className="nav flex-column">
            <Link to="/order_history" className="nav-link">
              Đơn Hàng Của Tôi
            </Link>
            <Link to="#change-password" className="nav-link active text-dr">
              Đổi Mật Khẩu
            </Link>
            <a href="#logout" className="nav-link">
              <FaSignOutAlt /> Đăng Xuất
            </a>
          </nav>
        </div>
        {/* Cột bên phải */}
        <div className="col-md-8">
          <div className="change-password">
            <div className="form-group">
              <label htmlFor="current-password">Mật Khẩu Hiện Tại</label>
              <div className="input-container">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="current-password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Mật Khẩu Mới</label>
              <div className="input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Xác Nhận Mật Khẩu Mới</label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <button className="btn btn-primary " onClick={handleChangePassword}>
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
      <ChangePassword />
    </div>
  );
}

export default App;
