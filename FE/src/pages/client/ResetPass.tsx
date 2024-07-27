import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Row, Col } from "antd";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const onFinish = async (values: { token: string; newPassword: string }) => {
    try {
      await axios.post("/api/reset-password", values);
      setAlert({
        type: "success",
        message: "Mật khẩu đã được đặt lại thành công.",
      });
      form.resetFields();
    } catch (error) {
      setAlert({
        type: "error",
        message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
      });
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Card title="Đặt Lại Mật Khẩu" bordered={false}>
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              showIcon
              style={{ marginBottom: "16px" }}
            />
          )}
          <Form
            form={form}
            name="reset-password"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Mã OTP"
              name="token"
              rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
            >
              <Input placeholder="Nhập mã OTP bạn nhận được" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;
