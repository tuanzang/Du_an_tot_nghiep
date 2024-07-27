import { useState } from "react";
import { Col, Empty, Input, Row, Typography, Button } from "antd";
import ProfileMenu from "./ProfileMenu";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import { IUser } from "../../../interface/Users";
import { EditOutlined } from "@ant-design/icons";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProfileChangePass() {
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (user === null) {
      toast.error("Không thể thay đổi mật khẩu");
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ các trường");
      return;
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      toast.error("Mật khẩu cũ không đúng");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/users/updatePassword", {
        userId: user._id,
        password: confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại" + error);
    }
  };

  return (
    <div>
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
                      <a href="/home">Trang chủ</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Tài khoản của tôi
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {user ? (
        <div
          className="container"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Thay đổi mật khẩu
              </Typography.Title>
              <Row gutter={16}>
                <Col span={24} style={{ marginBottom: "20px" }}>
                  <Typography.Title level={5}>Mật khẩu cũ</Typography.Title>
                  <Input.Password
                    style={{ width: "100%" }}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </Col>
                <Col span={24} style={{ marginBottom: "20px" }}>
                  <Typography.Title level={5}>Mật khẩu mới</Typography.Title>
                  <Input.Password
                    style={{ width: "100%" }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Col>
                <Col span={24} style={{ marginBottom: "20px" }}>
                  <Typography.Title level={5}>
                    Xác nhận mật khẩu mới
                  </Typography.Title>
                  <Input.Password
                    style={{ width: "100%" }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Col>
                <Col span={24}>
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    style={{
                      float: "right",
                      borderColor: "#c29957",
                      color: "#c29957",
                    }}
                    onClick={handleChangePassword}
                  >
                    Thay đổi
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="container">
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Thay đổi mật khẩu
              </Typography.Title>
              <Empty />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
