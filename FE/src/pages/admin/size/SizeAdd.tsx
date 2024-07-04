import type { FormProps } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { ISize } from '../../../interface/Size';

const SizeAdd = () => {

  const navigate = useNavigate()

  const onFinish: FormProps<ISize>['onFinish'] = async (values) => {

    const sizeCode = generateRandomNumber();

    const data = { ...values, sizeCode, status: false };
    console.log('Data to send:', data); 

    try {
      const response = await axios.post('http://localhost:3001/api/sizes/add', data);
      console.log('Response:', response.data); // Thêm console log để kiểm tra phản hồi từ server
      alert('Add size success');
      navigate('/admin/size');
    } catch (err) {
      console.error('Error:', err);
      alert('Add size failed. Please try again.');
    }
  };

  const generateRandomNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000);
  };

  const onFinishFailed: FormProps<ISize>['onFinishFailed'] = (errorInfo) => {
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
      <Form.Item<ISize>
        label="Size"
        name="size"
      >
        <Input type='text'/>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SizeAdd;