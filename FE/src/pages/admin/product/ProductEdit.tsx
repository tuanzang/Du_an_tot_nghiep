import React, { useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IProduct } from "../../../interface/Products";
import { ICategory } from "../../../interface/Categories";

const { Option } = Select;

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = React.useState<ICategory[]>([]);

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/products/${id}`),
          axios.get("http://localhost:3001/api/categories"),
        ]);
        form.setFieldsValue(productResponse.data.data);
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProductAndCategories();
  }, [form, id]);

  const onFinish = async (values: IProduct) => {
    try {
      await axios.put(`http://localhost:3001/api/products/${id}`, values);
      alert("Edit product success");
      navigate("/admin/product");
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="Tên sản phẩm" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Giá" name="price">
        <Input />
      </Form.Item>
      <Form.Item label="Danh mục" name="categoryId">
        <Select>
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.loai}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Số lượng" name="quantity">
        <Input />
      </Form.Item>
      <Form.Item label="Ảnh" name="image">
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductEdit;
