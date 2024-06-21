import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Slider,
  Table,
  Typography,
} from "antd";
import formatCurrency from "../../../services/common/formatCurrency";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { IProduct } from "../../../interface/Products";

export default function ProductDetailAndEdit() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<IProduct>({
    _id: 0,
    name: "",
    price: 0,
    size: "",
    image: [],
    description: "",
    quantity: 0,
    categoryId: [],
  });
  const [listUpdate, setListUpdate] = useState([]);
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
          {listUpdate.length > 0 && (
            <Button type="primary" style={{ float: "right" }}>
              Lưu thay đổi
            </Button>
          )}
          {listUpdate.length > 0 && (
            <Button danger style={{ float: "right", marginRight: 16 }}>
              Hủy bỏ thay đổi
            </Button>
          )}
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
                render: (index) => index + 1,
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
                render: (text) => <Input type="number" defaultValue={text} />,
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
                    <Button type="link" icon={<EditOutlined />} />
                    <Button type="link" danger>
                      Xóa
                    </Button>
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
        <Modal title="Thông báo" visible={open}>
          <Typography.Title>
            Bạn có muốn lưu các thay đổi không?
          </Typography.Title>
        </Modal>
      </Card>
    </div>
  );
}
