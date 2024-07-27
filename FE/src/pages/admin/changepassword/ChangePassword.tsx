import { Button, Card, Col, Empty, Input, Row, Typography } from "antd";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { IUser } from "../../../interface/Users";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import { useState } from "react";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";

export default function ChangePassword() {
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
      <BreadcrumbsCustom listLink={[]} nameHere={"Đổi mật khẩu"} />
      <Card bordered={false}>
        {user ? (
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
        ) : (
          <Empty />
        )}
      </Card>
    </div>
  );
}
