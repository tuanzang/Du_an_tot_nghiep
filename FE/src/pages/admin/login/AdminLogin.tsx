import React, { useState } from "react";
import { Input, Button, Typography, Layout, Form } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

export default function AdminLogin() {
  const [userLogin, setUserLogin] = useState({
    email: "", // Không có giá trị mặc định
    password: "", // Không có giá trị mặc định
  });

  const onSubmit = (userLogin) => {
    console.log(userLogin);
  };

  return (
    <Layout
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content
        style={{
          padding: "50px",
          width: "400px",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <Form>
          <LoginOutlined style={{ fontSize: "4rem", color: "#c29957" }} />
          <Title
            level={2}
            style={{ marginBottom: "20px", fontSize: "2rem", color: "#c29957" }}
          >
            Đăng nhập
          </Title>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Hãy nhập email của bạn!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
              value={userLogin.email}
              onChange={(e) =>
                setUserLogin({ ...userLogin, email: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Hãy nhập mật khẩu của bạn!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              value={userLogin.password}
              onChange={(e) =>
                setUserLogin({ ...userLogin, password: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", fontSize: "1rem" }}
              onClick={() => onSubmit(userLogin)}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" style={{ fontSize: "1.2rem" }}>
              Quên mật khẩu?
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}