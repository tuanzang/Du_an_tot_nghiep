import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Typography,
  Layout,
  Tabs,
  Card,
  message,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const InputForm = ({ label, Icon, id, isPass, defaultValue, chagneValue }) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <Form.Item
      label={label}
      htmlFor={id}
      style={{ width: "100%", marginBottom: "20px" }}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        prefix={<Icon style={{ color: "black" }} />}
        suffix={
          isPass ? (
            showPass ? (
              <EyeInvisibleOutlined
                onClick={() => {
                  setShowPass(!showPass);
                }}
                style={{ color: "black" }}
              />
            ) : (
              <EyeOutlined
                onClick={() => {
                  setShowPass(!showPass);
                }}
                style={{ color: "black" }}
              />
            )
          ) : null
        }
        onChange={(e) => {
          chagneValue(e.target.value);
        }}
        defaultValue={defaultValue}
        id={id}
        type={isPass && !showPass ? "password" : "text"}
        style={{ fontFamily: "Playfair", width: "100%" }}
      />
    </Form.Item>
  );
};

const RegisterPanel = () => {
  return (
    <Form>
      <InputForm label="Họ và tên *" Icon={UserOutlined} id="reg-input-user" />
      <InputForm
        label="Địa chỉ email *"
        Icon={MailOutlined}
        id="reg-input-email"
        type="email"
      />
      <InputForm
        label="Mật khẩu *"
        Icon={LockOutlined}
        id="reg-input-pass"
        isPass={true}
      />
      <InputForm
        isPass={true}
        label="Nhập lại mật khẩu *"
        Icon={LockOutlined}
        id="reg-input-repass"
      />
      <Button type="primary" style={{ marginRight: "15px" }}>
        Đăng ký
      </Button>
    </Form>
  );
};

const LoginPanel = () => {
  const [user, setUser] = useState({
    email: "lyntph25593@fpt.edu.vn",
    password: "123456",
  });

  const loginGoogle = (decoded) => {
    console.log(decoded);
  };

  return (
    <Form>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập địa chỉ email của bạn!" },
        ]}
        initialValue={user.email}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Địa chỉ email của bạn *"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }]}
        initialValue={user.password}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu *"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
      </Form.Item>

      <Form.Item>
        <Space direction="horizontal" style={{ width: "100%" }}>
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
          <GoogleOAuthProvider clientId="520968091112-fcbec2sb49beti8ugc2rmqngkdobq4j7.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                loginGoogle(decoded);
              }}
              onError={() => {
                message.error("Đăng nhập Google không thành công!");
              }}
            />
          </GoogleOAuthProvider>
        </Space>
      </Form.Item>
      <Typography>
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </Typography>
    </Form>
  );
};

const { Content } = Layout;
const { TabPane } = Tabs;
export default function ClientLogin() {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const token = getCookie("ClientToken");

  const [value, setValue] = useState(0);

  const handleChange = (key) => {
    setValue(Number(key));
  };

  return token ? (
    <Navigate to="/home" />
  ) : (
    <Layout
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content style={{ maxWidth: "600px", width: "100%", padding: "20px" }}>
        <Card bordered={false} style={{ padding: "20px" }}>
          <Tabs activeKey={String(value)} onChange={handleChange}>
            <TabPane
              tab={
                <Typography.Text
                  style={{
                    fontWeight: "800",
                    textTransform: "none",
                    fontFamily: "Playfair",
                    fontSize: "20px",
                    color: "black",
                  }}
                >
                  Đăng nhập
                </Typography.Text>
              }
              key="0"
            >
              <LoginPanel />
            </TabPane>
            <TabPane
              tab={
                <Typography.Text
                  style={{
                    fontWeight: "800",
                    textTransform: "none",
                    fontFamily: "Playfair",
                    fontSize: "20px",
                    color: "black",
                  }}
                >
                  Đăng ký
                </Typography.Text>
              }
              key="1"
            >
              <RegisterPanel setValue={setValue} />
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}
