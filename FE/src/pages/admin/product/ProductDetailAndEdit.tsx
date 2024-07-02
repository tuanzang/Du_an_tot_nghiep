import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import {
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Slider,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import formatCurrency from "../../../services/common/formatCurrency";
import {
  DeleteOutlined,
  EditOutlined,
  PictureOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface IProduct {
  id: number;
  name: string;
}

interface ISize {
  id: number;
  name: string;
}

interface ICategory {
  id: number;
  name: string;
}

interface IProductDetail {
  product: IProduct | null;
  price: number | null;
  amount: number | null;
  weight: number | null;
  size: ISize | null;
  image: string[];
  description: string | null;
  quantity: number | null;
  category: ICategory | null;
}

export default function ProductDetailAndEdit() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [product, setProduct] = useState<IProductDetail>({
    product: null,
    price: null,
    amount: null,
    weight: null,
    size: null,
    image: [],
    description: null,
    quantity: null,
    category: null,
  });
  const [priceMax, setPriceMax] = useState(999999999);
  const listProductDetail = [
    {
      id: 1,
      name: "Product 1",
      price: 100000,
      image: "https://via.placeholder.com/100",
      code: "P001",
      amount: 10,
      category: "Category A",
      size: "L",
      deleted: 0,
    },
    {
      id: 2,
      name: "Product 2",
      price: 200000,
      image: "https://via.placeholder.com/100",
      code: "P002",
      amount: 5,
      category: "Category B",
      size: "M",
      deleted: 0,
    },
    {
      id: 3,
      name: "Product 3",
      price: 300000,
      image: "https://via.placeholder.com/100",
      code: "P003",
      amount: 20,
      category: "Category C",
      size: "S",
      deleted: 0,
    },
    {
      id: 4,
      name: "Product 4",
      price: 400000,
      image: "https://via.placeholder.com/100",
      code: "P004",
      amount: 15,
      category: "Category D",
      size: "XL",
      deleted: 0,
    },
    {
      id: 5,
      name: "Product 5",
      price: 500000,
      image: "https://via.placeholder.com/100",
      code: "P005",
      amount: 8,
      category: "Category E",
      size: "XXL",
      deleted: 0,
    },
  ];

  const [filter, setFilter] = useState({
    product: id,
    name: null,
    sizeFilter: null,
    category: null,
    status: null,
    priceMin: 0,
    size: 5,
    page: 1,
  });

  const sizes = [
    { value: null, label: "Tất cả" },
    { value: 1, label: "X" },
    { value: 2, label: "M" },
    { value: 3, label: "L" },
  ];
  const categorys = [
    { value: null, label: "Tất cả" },
    { value: 1, label: "Nhẫn" },
    { value: 2, label: "Lắc tay" },
    { value: 3, label: "Dây chuyền" },
  ];

  const statusList = [
    { value: null, label: "Tất cả" },
    { value: true, label: "Hoạt động" },
    { value: false, label: "Ngừng hoạt động" },
  ];

  const calculateTotalPrice = () => {
    return listProductDetail.reduce(
      (total, product) => total + product.price,
      0
    );
  };

  return (
    <div>
      <BreadcrumbsCustom
        listLink={[{ link: "/admin/product", name: "Sản phẩm" }]}
        nameHere={`${id}`}
      />
      <Card style={{ padding: "16px" }}>
        <div style={{ padding: 16, backgroundColor: "#fff" }}>
          <Row justify="space-between" align="middle">
            <Col span={11}>
              <Input
                placeholder="Nhập mã sản phẩm để tìm..."
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={12}>
              <Typography.Title level={5}>0 VND</Typography.Title>
              <Typography.Title level={5} style={{ float: "right" }}>
                {formatCurrency({ money: String(calculateTotalPrice()) })}
              </Typography.Title>
              <Slider
                range
                min={0}
                max={calculateTotalPrice()}
                defaultValue={[filter.priceMin, priceMax]}
                onChange={(value: number[]) => {
                  setFilter({ ...filter, priceMin: value[0] });
                  setPriceMax(value[1]);
                }}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div className="filter">
                <Typography.Title level={5}>Danh mục:</Typography.Title>
                <Select
                  value={filter.category}
                  onChange={(value) =>
                    setFilter({ ...filter, category: value })
                  }
                  options={categorys}
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="filter">
                <Typography.Title level={5}>Kích cỡ:</Typography.Title>
                <Select
                  value={filter.sizeFilter}
                  onChange={(value) =>
                    setFilter({ ...filter, sizeFilter: value })
                  }
                  options={sizes}
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="filter">
                <Typography.Title level={5}>Trạng thái:</Typography.Title>
                <Select
                  value={filter.status}
                  onChange={(value) => setFilter({ ...filter, status: value })}
                  options={statusList}
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ padding: 16, backgroundColor: "#fff", marginTop: 16 }}>
          <Typography.Title
            level={4}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Danh sách sản phẩm
          </Typography.Title>
          {/* {listUpdate.length > 0 && (
            <Button type="primary" style={{ float: "right" }}>
              Lưu thay đổi
            </Button>
          )}
          {listUpdate.length > 0 && (
            <Button danger style={{ float: "right", marginRight: 16 }}>
              Hủy bỏ thay đổi
            </Button>
          )} */}
          <Table
            dataSource={listProductDetail}
            rowKey="id"
            pagination={false}
            bordered
            columns={[
              {
                title: "STT",
                dataIndex: "id",
                key: "id",
                render: (index) => index,
              },
              {
                title: "Ảnh sản phẩm",
                dataIndex: "image",
                key: "image",
                render: (text) => (
                  <img src={text} alt="" style={{ width: 100, height: 100 }} />
                ),
              },
              {
                title: "Mã sản phẩm",
                dataIndex: "code",
                key: "code",
              },
              {
                title: "Tên sản phẩm",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Số lượng",
                dataIndex: "amount",
                key: "amount",
              },
              {
                title: "Giá bán",
                dataIndex: "price",
                key: "price",
                render: (text) => formatCurrency(text),
              },
              {
                title: "Thao tác",
                key: "action",
                render: () => (
                  <Fragment>
                    <Button
                      type="link"
                      onClick={() => setOpenUpdate(true)}
                      icon={<EditOutlined />}
                    />
                    <Button type="link" danger icon={<DeleteOutlined />} />
                  </Fragment>
                ),
              },
            ]}
          />
          {listProductDetail.length === 0 && (
            <Empty description="Không có dữ liệu" />
          )}
        </div>
        <Pagination
          style={{ textAlign: "center", marginTop: 16 }}
          total={10}
          current={filter.page}
          onChange={(page) => setFilter({ ...filter, page })}
          pageSize={filter.size}
        />
        <Modal title="Thông báo" open={open} onCancel={() => setOpen(false)}>
          <Typography.Title>
            Bạn có muốn lưu các thay đổi không?
          </Typography.Title>
        </Modal>

        {/* Modal update */}
        <Modal
          title="Cập nhật sản phẩm"
          open={openUpdate}
          onCancel={() => setOpenUpdate(false)}
          onOk={() => console.log("aaaa")}
        >
          <div>
            <Space direction="vertical">
              <Typography.Text style={{ fontWeight: 600, color: "gray" }}>
                {`${product.category?.name} ${product.product?.name} ${product.size?.name}`}
              </Typography.Text>
              {product ? (
                <Table
                  style={{ marginTop: "16px", marginBottom: "16px" }}
                  pagination={false}
                  rowKey="key"
                >
                  <Table.Column
                    title="Sản phẩm"
                    render={() => (
                      <Typography.Text>{product.product?.name}</Typography.Text>
                    )}
                  />
                  <Table.Column
                    title="Kích cỡ"
                    render={(_, record: IProductDetail) => (
                      <Typography.Text>{record.size?.name}</Typography.Text>
                    )}
                  />
                  <Table.Column
                    title="Cân nặng"
                    render={(_, record: IProductDetail) => (
                      <Input
                        value={record.weight ? Number(record.weight) : 0}
                        suffix="g"
                        style={{ textAlign: "center" }}
                      />
                    )}
                  />
                  <Table.Column
                    title="Số lượng"
                    render={(_, record: IProductDetail) => (
                      <Input
                        value={record.amount ? Number(record.amount) : 0}
                      />
                    )}
                  />
                  <Table.Column
                    title="Giá"
                    render={(_, record: IProductDetail) => (
                      <Input
                        value={record.price ? Number(record.price) : 0}
                        style={{ textAlign: "center" }}
                      />
                    )}
                  />
                  <Table.Column
                    title="Ảnh"
                    render={(_, record: IProductDetail) => (
                      <Space direction="horizontal" align="center">
                        {record.image.length > 0 ? (
                          record.image.map((ima: string, index: number) => (
                            <Image
                              key={`showImage${index}`}
                              width={100}
                              height={100}
                              src={ima}
                              alt="anh-san-pham"
                              style={{ border: "1px dashed #ccc" }}
                            />
                          ))
                        ) : (
                          <Tooltip title="Chỉnh sửa ảnh">
                            <div
                              style={{
                                cursor: "pointer",
                                border: "1px dashed #ccc",
                                width: "100px",
                                height: "100px",
                                textAlign: "center",
                                lineHeight: "100px",
                              }}
                            >
                              <PictureOutlined
                                style={{
                                  fontSize: "20px",
                                  marginRight: "5px",
                                }}
                              />
                              Ảnh
                            </div>
                          </Tooltip>
                        )}
                      </Space>
                    )}
                  />
                </Table>
              ) : (
                <img
                  height={"200px"}
                  width={"100%"}
                  src={"../../src/assets/image/404-page.gif"}
                  alt="no-data"
                />
              )}
            </Space>
          </div>
        </Modal>
      </Card>
    </div>
  );
}
