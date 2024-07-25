/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import AuthApi, { ISignInBody } from "../../config/authApi";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_INFO_STORAGE_KEY,
} from "../../services/constants";
import { useState } from "react";

interface IFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPanel = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const selectPassword = Form.useWatch("password", form);

  const onSubmit = async (formData: IFormData) => {
    try {
      await AuthApi.signUp(formData);
      message.success("Đăng ký thành công, vui lòng đăng nhập");
      navigate("/login");
    } catch (error: any) {
      message.info(
        error?.response?.data?.messages || "Có lỗi xảy ra, vui lòng thử lại"
      );
      console.log(error);
    }
  };

  return (
    <Form onFinish={onSubmit} form={form}>
      <Form.Item
        label="Họ và tên"
        style={{ width: "100%", marginBottom: "20px" }}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập họ tên",
          },
          {
            min: 3,
            message: "Vui lòng nhập tối thiểu 3 ký tự",
          },
          {
            max: 30,
            message: "Tên dài tối đa 30 ký tự",
          },
        ]}
        name="name"
      >
        <Input
          prefix={<UserOutlined color="black" />}
          style={{ fontFamily: "Playfair", width: "100%" }}
          placeholder="Nhập họ tên"
        />
      </Form.Item>

      <Form.Item
        label="Email"
        style={{ width: "100%", marginBottom: "20px" }}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="email"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập email",
          },
          {
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Email không đúng định dạng",
          },
        ]}
      >
        <Input
          prefix={<MailOutlined color="black" />}
          placeholder="Nhập email"
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        style={{ width: "100%", marginBottom: "20px" }}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
          },
          {
            min: 6,
            message: "Mật khẩu tối thiểu 6 ký tự",
          },
        ]}
        name="password"
      >
        <Input.Password
          prefix={<LockOutlined color="black" />}
          placeholder="Nhập mật khẩu"
        />
      </Form.Item>

      <Form.Item
        dependencies={["password"]}
        label="Xác nhận mật khẩu"
        style={{ width: "100%", marginBottom: "20px" }}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập lại mật khẩu",
          },
          {
            validator: (_, value) => {
              if (value && value !== selectPassword) {
                return Promise.reject("Mật khẩu xác nhận không chính xác");
              }
              return Promise.resolve();
            },
          },
        ]}
        name="confirmPassword"
      >
        <Input.Password
          prefix={<LockOutlined color="black" />}
          placeholder="Nhập lại mật khẩu"
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" style={{ marginRight: "15px" }}>
        Đăng ký
      </Button>
    </Form>
  );
};

const LoginPanel = () => {
  const navigate = useNavigate();
  const [userBlocked, setUserBlocked] = useState(false);

  const onSubmit = async (formData: ISignInBody) => {
    try {
      const { data } = await AuthApi.signIn(formData);

      if (data?.user?.blocked) {
        setUserBlocked(true);
        message.error(
          "Tài khoản của bạn đã bị chặn. Vui lòng liên hệ với quản trị viên."
        );
      } else {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data?.token);
        localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(data?.user));

        // Redirect user based on role or default path
        if (data?.user?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.messages || "Có lỗi xảy ra, vui lòng thử lại"
      ); // Error message
      console.log(error); // Log the error for debugging
    }
  };

  return (
    <Form onFinish={onSubmit}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập địa chỉ email của bạn!" },
          {
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Email không đúng định dạng",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Địa chỉ email của bạn *"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu *" />
      </Form.Item>

      <Form.Item>
        <Space direction="horizontal" style={{ width: "100%" }}>
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
          <GoogleOAuthProvider clientId="520968091112-fcbec2sb49beti8ugc2rmqngkdobq4j7.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={(e) => console.log(e)}
              onError={() => {
                message.error("Đăng nhập Google không thành công!");
              }}
            />
          </GoogleOAuthProvider>
        </Space>
      </Form.Item>
      <Typography>
        <Link to="/forgotPass">Quên mật khẩu?</Link>
      </Typography>
    </Form>
  );
};

const { Content } = Layout;
const { TabPane } = Tabs;
export default function ClientLogin() {
  const navigate = useNavigate();

  const params = useParams();
  const activeTab = params["*"] === "login" ? "0" : "1";

  const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  const onTabChange = (tab: string) => {
    navigate(tab === "0" ? "/login" : "/register");
  };

  return isLogged ? (
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
          <Tabs activeKey={activeTab} onChange={onTabChange}>
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
              <RegisterPanel />
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}
