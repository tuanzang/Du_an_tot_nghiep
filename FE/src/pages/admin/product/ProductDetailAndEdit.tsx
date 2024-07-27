import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { Button, Card, Form, Image, Upload, Input, InputNumber } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib";
import { IProduct } from "../../../interface/Products";
import { IProductSize } from "../../../interface/ProductSize";

const { TextArea } = Input;

export default function ProductDetailAndEdit() {
  const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  // const [priceOld, setPriceOld] = useState<number | undefined>(undefined);
  // const [category, setCategory] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [productSizes, setProductSizes] = useState<IProductSize[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isChanged1, setIsChanged1] = useState(false);
  const [isChanged2, setIsChanged2] = useState(false);

  useEffect(() => {
    // Gọi API để lấy chi tiết sản phẩm
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/products/${id}`
        );
        setProduct(data.data);
        setName(data.data.name);
        setPrice(data.data.price);
        // setPriceOld(data.data.priceOld);
        setDescription(data.data.description);
        if (data.data.image) {
          setFileList(
            data.data.image.map((url: string) => ({
              uid: url,
              name: url.split("/").pop() || "",
              status: "done",
              url,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    // Gọi API để lấy số lượng sản phẩm theo kích cỡ
    const fetchProductSizes = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/products/productSize/${id}`
        );
        setProductSizes(data.data);

        // Cập nhật state quantities
        const initialQuantities: { [key: string]: number } = {};
        data.data.forEach((productSize: IProductSize) => {
          initialQuantities[productSize.sizeName] = productSize.quantity;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching product sizes:", error);
      }
    };

    fetchProductDetails(); 
    fetchProductSizes();
  }, [id]);

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (sizeName: any, value: any) => {
    setQuantities({
      ...quantities,
      [sizeName]: value,
    });
    setIsChanged1(true);
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    setIsChanged(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsChanged(true);
  };

  const handlePriceChange = (value: number|any) => {
    setPrice(value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  // Tính tổng số lượng tất cả các size
  const totalQuantity = Object.values(quantities).reduce(
    (acc, qty) => acc + qty,
    0
  );

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name || "");
      formData.append("price", (price || 0).toString());
      formData.append("description", description || "");

      // Nối fileList vào formData
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("image", file.originFileObj);
        }
      });

      // Cập nhật thông tin sản phẩm
      await axios.put(`http://localhost:3001/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Cập nhật sản phẩm thất bại");
    }
  };

  const handleUpdateProductSize = async () => {
    try {
      for (const productSize of productSizes) {
        const updatedQuantity = quantities[productSize.sizeName];
        await axios.put(
          `http://localhost:3001/api/products/productSize/${productSize._id}`,
          {
            quantity: updatedQuantity,
          }
        );
      }
      alert("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Đã xảy ra lỗi khi cập nhật sản phẩm");
    }
  };

  return (
    <div>
      <BreadcrumbsCustom
        listLink={[{ link: "/admin/product", name: "Sản phẩm" }]}
        nameHere={`Chi tiết sản phẩm ${name}`}
      />
      <div className="w-50 mx-auto">
        <Card style={{ padding: "10px", marginBottom: "10px" }}>
          <form>
            <div className="form-group">
              <label htmlFor="">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Tên sản phẩm"
              />
            </div>

      <Card style={{ padding: "16px", backgroundColor: "#f9f9f9" }}>
        <div className="container">
          <div
            className="row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="col-md-8">
              <p
                className="pb-3"
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "calc(1.2rem + 0.15vw)",
                  color: "#c29957",
                  textAlign: "center",
                }}
              >
                Chi tiết sản phẩm
              </p>
              <Form layout="vertical">
                <Form.Item
                  label="Tên"
                  style={{ fontSize: "20px", color: "#333" }}
                >
                  <Input
                    value={name}
                    onChange={handleNameChange}
                    style={{ borderColor: "#c29957" }}
                  />
                </Form.Item>

                <Form.Item
                  label="Giá"
                  style={{ fontSize: "20px", color: "#333" }}
                >
                  <InputNumber
                    value={price}
                    onChange={handlePriceChange}
                    style={{ width: "100%", borderColor: "#c29957" }}
                    min={0}
                    formatter={(value) =>
                      `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Số lượng"
                  style={{ fontSize: "20px", color: "#333" }}
                >
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    {productSizes.map((productSize) => (
                      <div
                        key={productSize._id}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <p
                          className="mt-2"
                          style={{ marginRight: "10px", color: "#555" }}
                        >
                          Size {productSize.sizeName}
                        </p>
                        <InputNumber
                          value={quantities[productSize.sizeName] || 0}
                          onChange={(value) =>
                            handleQuantityChange(productSize.sizeName, value)
                          }
                          min={0}
                          style={{ flex: "1", borderColor: "#c29957" }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="form-group mt-2">
                    <label style={{ fontSize: "20px", color: "#333" }}>
                      Tổng số lượng
                    </label>
                    <p
                      className="form-control"
                      style={{
                        width: "100%",
                        textAlign: "center",
                        borderColor: "#c29957",
                      }}
                    >
                      {totalQuantity} chiếc
                    </p>
                  </div>
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  style={{ fontSize: "20px", color: "#333" }}
                >
                  <TextArea
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                    style={{ borderColor: "#c29957" }}
                  />
                </Form.Item>

                {/* upload ảnh */}
                <Form.Item
                  label="Ảnh"
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng tải lên ảnh sản phẩm!",
                    },
                  ]}
                  style={{ fontSize: "20px", color: "#333" }}
                >
                  <Upload
                    name="image"
                    listType="picture"
                    beforeUpload={() => false}
                    multiple
                    accept=".jpg,.png,.jpeg"
                    onChange={handleUploadChange}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      style={{
                        backgroundColor: "#c29957",
                        borderColor: "#c29957",
                        color: "#fff",
                      }}
                    >
                      Tải ảnh lên
                    </Button>
                  </Upload>
                </Form.Item>

                <div className="row mt-4">
                  <div
                    className=""
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {fileList.map((file) => (
                      <Image
                        key={file.uid}
                        width={"20%"}
                        src={file.url}
                        alt="product-details"
                        style={{ marginRight: "10px", borderColor: "#c29957" }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5" style={{ textAlign: "center" }}>
                  <Button
                    className="btn bg-primary p-2 border text-white"
                    icon={<EditOutlined />}
                    onClick={handleUpdateProduct}
                    style={{
                      backgroundColor: "#c29957",
                      borderColor: "#c29957",
                      color: "#fff",
                    }}
                  >
                    Cập nhật
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


