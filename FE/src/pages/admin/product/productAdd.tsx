import type { FormProps } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, Upload, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IProduct } from '../../../interface/Products';
import { useEffect, useState } from 'react';
import { ICategory } from '../../../interface/Categories';
import { toast } from "react-toastify";
import { uploadImage } from "../../../services/upload/upload";
import { UploadFile } from "antd/lib";
// import { List, Card, notification } from 'antd';
import { ISize } from '../../../interface/Size';


const ProductAdd = () => {
  const navigate = useNavigate()

  const [cates, setCates] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/categories");
        setCates(response.data?.data);

        const responseSizes = await axios.get("http://localhost:3001/api/sizes");
        setSizes(responseSizes.data?.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dataCates = cates.map((item: ICategory) => {
    return {
      value: item._id,
      label: item.loai
    }
  })

  const dataSize = sizes.map((size: ISize) => {
    return {
      value: size._id,
      label: size.name
    }
  })

  const onFinish: FormProps<IProduct[]>["onFinish"] = async (values) => {
    try {
      // Upload images
      // Lấy danh sách các file từ fileList
      const imageFiles: File[] = fileList.map(file => file.originFileObj as File);

      // Upload images
      const uploadedImageUrls = await uploadImage(imageFiles);
      //  console.log("Uploaded image URLs:", uploadedImageUrls);

      // Update values with uploaded image URLs
      const updatedValues = { ...values, image: uploadedImageUrls };

      // Send product data to server
      await axios.post(`http://localhost:3001/api/products/add`, updatedValues);

      toast.success("Thêm sản phẩm thành công");
      navigate("/admin/product");
    } catch (err) {
      console.log(err);
    }
  };


  const onFinishFailed: FormProps<IProduct[]>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
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
      >
        <Input type='text' />
      </Form.Item>
      <Form.Item<IProduct>
        label="Giá"
        name="price"
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        label="Danh mục"
        name="categoryId"
      >
        <Select

          defaultValue="Chọn danh mục"
          style={{
            width: 150,
          }}

          options={dataCates}
        />
      </Form.Item>

      <Form.Item<IProduct>
        label="Size"
        name="sizeId"
        rules={[{ required: true, message: 'Vui lòng chọn size!' }]}
      >
        <Checkbox.Group options={dataSize} />
      </Form.Item>

      <Form.Item<IProduct>
        label="Số lượng"
        name="quantity"
      >
        <Input />
      </Form.Item>

      {/* upload ảnh */}
      <Form.Item
        label="Ảnh"
        name="image"
        rules={[
          { required: true, message: "Vui lòng tải lên ảnh sản phẩm!" },
        ]}
      >
        <Upload
          name="image"
          listType="picture"
          // maxCount={1}
          beforeUpload={() => false}
          multiple
          accept=".jpg,.png,.jpeg"
          onChange={handleUploadChange}
        >
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Form.Item>

      <Form.Item<IProduct>
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

export default ProductAdd;