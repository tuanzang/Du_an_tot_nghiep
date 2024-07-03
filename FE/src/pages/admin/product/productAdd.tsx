import type { FormProps } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select } from 'antd';
import { IProduct } from '../../../interface/Products';
import { useEffect, useState } from 'react';
import { ICategory } from '../../../interface/Categories';
import TextArea from 'antd/es/input/TextArea';

const ProductAdd = () => {
  const navigate = useNavigate();
  const [cates, setCates] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/categories");
        setCates(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const dataCates = cates.map((item: ICategory) => {
    return {
      value: item._id, label: item.loai
    }
  });

  const onFinish: FormProps<IProduct>['onFinish'] = async (values) => {
    try {
      await axios.post("http://localhost:3001/api/products/add", values);
      alert('Add product success');
      navigate("/admin/product");
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed: FormProps<IProduct>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
      <Form.Item<IProduct>
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        label="Giá"
        name="price"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item<IProduct>
        label="Giá cũ"
        name="priceOld"
        rules={[{ required: true, message: "Vui lòng nhập giá cũ sản phẩm!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item<IProduct>
        label="Danh mục"
        name="categoryId"
        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
      >
        <Select style={{ width: 150 }} options={dataCates} />
      </Form.Item>
      <Form.Item<IProduct>
        label="Số lượng"
        name="quantity"
        rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item<IProduct>
        label="Ảnh"
        name="image"
        rules={[{ required: true, message: "Vui lòng nhập URL ảnh!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <TextArea rows={4} />
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
