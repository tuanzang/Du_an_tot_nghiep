import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useEffect } from 'react';
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import {
  Button,
  Card,
  Form,
  Image,
  Upload,
} from "antd";
// import formatCurrency from "../../../services/common/formatCurrency";
import {
  EditOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { UploadFile } from "antd/lib";
import { IProduct } from '../../../interface/Products';
import { IProductSize } from "../../../interface/ProductSize";


export default function ProductDetailAndEdit() {
  const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [productSizes, setProductSizes] = useState<IProductSize[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Gọi API để lấy chi tiết sản phẩm
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(data.data);
        setName(data.data.name);
        setPrice(data.data.price);
        setDescription(data.data.description);
        if (data.data.image) {
          setFileList(data.data.image.map((url: string) => ({
            uid: url,
            name: url.split('/').pop() || '',
            status: 'done',
            url,
          })));
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    // Gọi API để lấy số lượng sản phẩm theo kích cỡ
    const fetchProductSizes = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/products/productSize/${id}`);
        setProductSizes(data.data);

        // Cập nhật state quantities
        const initialQuantities: { [key: string]: number } = {};
        data.data.forEach((productSize: IProductSize) => {
          initialQuantities[productSize.sizeName] = productSize.quantity;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching product sizes:', error);
      }
    };

    fetchProductDetails();
    fetchProductSizes();
  }, [id]);

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (sizeName: any, value: any) => {
    setQuantities({
      ...quantities,
      [sizeName]: value
    });
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // Tính tổng số lượng tất cả các size
  const totalQuantity = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name || '');
      formData.append('price', (price || 0).toString());
      formData.append('description', description || '');

      // Nối fileList vào formData
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('image', file.originFileObj);
        }
      });

      // Cập nhật thông tin sản phẩm
      await axios.put(`http://localhost:3001/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Cập nhật số lượng sản phẩm theo kích cỡ
      for (const productSize of productSizes) {
        const updatedQuantity = quantities[productSize.sizeName];
        await axios.put(`http://localhost:3001/api/products/productSize/${productSize._id}`, {
          quantity: updatedQuantity,
        });
      }
      alert('Cập nhật sản phẩm thành công');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Đã xảy ra lỗi khi cập nhật sản phẩm');
    }
  };

  return (
    <div>
      <BreadcrumbsCustom
        listLink={[{ link: "/admin/product", name: "Sản phẩm" }]}
        nameHere={`${id}`}
      />

      <Card style={{ padding: "16px" }}>

        <div className="container" >
          <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="col-md-6">
              <p className="pb-3" style={{
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "calc(1.2rem + 0.15vw)",
                color: "#c29957",
              }}>Chi tiết sản phẩm</p>
              <div className="form-group">
                <label style={{ fontSize: '20px' }}>Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="" style={{ fontSize: '20px' }}>Giá</label>
                <input
                  type="text"
                  className="form-control"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>

              <div>
                <label htmlFor="" style={{ fontSize: '20px' }}>Số lượng</label>
                <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                  {productSizes.map((productSize) => (
                    <React.Fragment key={productSize._id}>
                      <p className="mt-2">{productSize.sizeName}</p>
                      <input
                        type="text"
                        className="form-control"
                        value={quantities[productSize.sizeName] || ''}
                        onChange={(e) => handleQuantityChange(productSize.sizeName, e.target.value)}
                      />
                    </React.Fragment>
                  ))}
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="" style={{ fontSize: '20px' }}>Tổng số lượng</label>
                  <p className="form-control">{totalQuantity}</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="" style={{ fontSize: '20px' }}>Mô tả</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>

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
                  beforeUpload={() => false}
                  multiple
                  accept=".jpg,.png,.jpeg"
                  onChange={handleUploadChange}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>

              <div className="row mt-4">
                <div
                  className=""
                  style={{ marginBottom: "10px" }}
                >
                  <Image
                    width={"20%"}
                    src={product?.image?.[0]}
                    alt="product-details"
                  />
                </div>
              </div>

            </div>
          </div>


        </div>

        <div className="mt-5" style={{ float: "right" }}>
          <Button className="btn bg-primary p-2 border text-white" icon={<EditOutlined />} onClick={handleUpdateProduct}>Cập nhật</Button>
        </div>

      </Card>

    </div>
  );
}
