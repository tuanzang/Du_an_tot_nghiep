import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const navigate = useNavigate();

  const handleRequestOTP = async (values: { email: string }) => {
    try {
      // Giả lập việc gửi mã OTP qua email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmail(values.email);
      setOtp("123456"); // Giả lập mã OTP
      setStep("reset");
      setAlert({
        type: "success",
        message: "Mã OTP đã được gửi đến email của bạn.",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
      });
    }
  };

  const handleResetPassword = async (values: {
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (values.otp !== otp) {
        throw new Error("Mã OTP không đúng.");
      }
      if (values.newPassword !== values.confirmPassword) {
        throw new Error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      }

      // Giả lập việc đặt lại mật khẩu
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAlert({
        type: "success",
        message: "Mật khẩu đã được đặt lại thành công.",
      });
      form.resetFields();
      setStep("request");
      setOtp("");
      navigate("/home"); // Chuyển hướng về trang chủ sau khi đặt lại mật khẩu thành công
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi, vui lòng thử lại sau.";
      setAlert({ type: "error", message: errorMessage });
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Card
          title={step === "request" ? "Quên Mật Khẩu" : "Đặt Lại Mật Khẩu"}
          bordered={false}
        >
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              showIcon
              style={{ marginBottom: "16px" }}
            />
          )}
          {step === "request" ? (
            <Form
              form={form}
              name="forgot-password-request"
              onFinish={handleRequestOTP}
              layout="vertical"
            >
              <Form.Item
                label="Địa chỉ email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Vui lòng nhập địa chỉ email hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập địa chỉ email của bạn" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Gửi mã OTP
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form
              form={form}
              name="reset-password"
              onFinish={handleResetPassword}
              layout="vertical"
            >
              <Form.Item
                label="Mã OTP"
                name="otp"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
              >
                <Input placeholder="Nhập mã OTP bạn nhận được" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu mới!",
                  },
                  {
                    min: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự.",
                  },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xác nhận mật khẩu mới!",
                  },
                  {
                    validator: (_, value) => {
                      const newPassword = form.getFieldValue("newPassword");
                      if (value && value !== newPassword) {
                        return Promise.reject(
                          new Error(
                            "Mật khẩu xác nhận không khớp với mật khẩu mới."
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu mới" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
