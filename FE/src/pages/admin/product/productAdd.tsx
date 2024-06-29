import type { FormProps } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select } from "antd";
import { IProduct } from "../../../interface/Products";
import { useEffect, useState } from "react";
import { ICategory } from "../../../interface/Categories";
import { toast } from "react-toastify";

const ProductAdd = () => {
  const navigate = useNavigate();

  const [cates, setCates] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCates(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dataCates = cates.map((item: ICategory) => ({
    value: item._id,
    label: item.loai,
  }));

  const onFinish: FormProps<IProduct>["onFinish"] = async (values) => {
    try {
      await axios.post(`http://localhost:3001/api/products/add`, values);
      toast.success("Thêm sản phẩm thành công");
      console.log(values);
      navigate("/admin/product");
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed: FormProps<IProduct>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Giá"
        name="price"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Danh mục"
        name="categoryId"
        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
      >
        <Select
          placeholder="Chọn danh mục"
          style={{ width: "100%" }}
          options={dataCates}
        />
      </Form.Item>
      <Form.Item
        label="Số lượng"
        name="quantity"
        rules={[
          { required: true, message: "Vui lòng nhập số lượng sản phẩm!" },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Ảnh"
        name="image"
        rules={[
          { required: true, message: "Vui lòng nhập đường dẫn ảnh sản phẩm!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductAdd;
