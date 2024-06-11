import type { FormProps } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { ICategory } from '../../../interface/Categories';


const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`http://localhost:3001/api/categories/${id}`);
      form.setFieldsValue(data.data);
      return data
    })();
  }, [id]);
  const onFinish: FormProps<ICategory>['onFinish'] = async  (values) => {
    console.log('Success:', values);
      try {
      await axios.put(`http://localhost:3001/api/categories/${id}`, values);
      alert( 'Edit category success')
      navigate("/admin/category")
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed: FormProps<ICategory>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<ICategory>
        label="Size"
        name="size"
      >
        <Input type='text'/>
      </Form.Item>
      <Form.Item<ICategory>
        label="Color"
        name="color"
      >
        <Input />
      </Form.Item>
      <Form.Item<ICategory>
        label="Slug"
        name="slug"
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

export default CategoryEdit;