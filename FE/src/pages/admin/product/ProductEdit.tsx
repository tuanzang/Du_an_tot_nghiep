import type { FormProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IProduct } from "../../../interface/Products";
import { UploadFile } from "antd/es/upload/interface";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/products/${id}`
        );
        console.log("Fetched data:", data.data); // Debugging line

        form.setFieldsValue(data.data);

        // Ensure `data.data.image` is an array of image URLs
        const imageUrls: string[] = Array.isArray(data.data.image)
          ? data.data.image
          : [];
        console.log("Image URLs:", imageUrls); // Debugging line

        setFileList(
          imageUrls.map((url: string) => ({
            uid: url,
            name: url.split("/").pop() || "image",
            status: "done",
            url,
          }))
        );
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    })();
  }, [id, form]);

  const onFinish: FormProps<IProduct>["onFinish"] = async (values) => {
    try {
      // Prepare file URLs from fileList
      const images = fileList.map((file) => file.url).filter((url) => url); // Ensure non-null URLs
      const updatedValues = { ...values, image: images };

      console.log("Updating product with values:", updatedValues); // Debugging line

      await axios.put(
        `http://localhost:3001/api/products/${id}`,
        updatedValues
      );
      alert("Edit product success");
      navigate("/admin/product");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const onFinishFailed: FormProps<IProduct>["onFinishFailed"] = (errorInfo) => {
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
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<IProduct> label="Tên sản phẩm" className="name">
        <Input type="text" />
      </Form.Item>
      <Form.Item<IProduct> label="Giá" className="price">
        <Input />
      </Form.Item>
      <Form.Item<IProduct> label="Giá cũ" className="priceOld">
        <Input />
      </Form.Item>
      <Form.Item<IProduct> label="Số lượng" className="quantity">
        <Input />
      </Form.Item>
      <Form.Item<IProduct> label="Ảnh" className="image">
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false} // Prevent automatic upload
          multiple
          accept=".jpg,.png,.jpeg"
        >
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Form.Item>
      <Form.Item<IProduct> label="Mô tả" className="description">
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
