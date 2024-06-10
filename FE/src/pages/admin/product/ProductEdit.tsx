import type { FormProps } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
type FieldType = {
  name?: string;
  price?: string;
  image?: string;
  description?: string;
  quantity?: string;
};

const ProductEdit = () => {
  const [product, setProduct] = useState<any>({});
  const { id } = useParams();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`http://localhost:3001/api/products/${id}`);
      // setProduct(data.data)
      const product = data.data
      form.setFieldsValue(product);
      return data
    })();
  }, [id]);

  // const onSubmit: SubmitHandler<IProduct> = async (data) => {
  //   try {
  //     await axios.put(`http://localhost:3001/api/products/${id}`, data);
  //     alert('Success')
  //     navigate("/admin/product")
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  const onFinish: FormProps<FieldType>['onFinish'] = async  (values) => {
    console.log('Success:', values);
      try {
      await axios.put(`http://localhost:3001/api/products/${id}`, values);
      alert( 'Edit product success')
      // navigate("/admin/product")
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      // initialValues={{
      //   name: product?.name,
      //   price: product?.price,
        // image: product?.image,
        // description: product?.description
      // }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Tên sản phẩm"
        name="name"
      >
        <Input type='text'/>
      </Form.Item>
      <Form.Item<FieldType>
        label="Giá"
        name="price"
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Số lượng"
        name="quantity"
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Ảnh"
        name="image"
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Mô tả"
        name="description"
      >
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