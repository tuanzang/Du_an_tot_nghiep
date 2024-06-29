import React, { useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  DatePicker,
  Table,
  Select,
  Pagination,
  // Pagination,
} from "antd";

import {
  ScheduleOutlined,
  RiseOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import PieChartDashBoard from "./PieChartDashBoard";
import formatCurrency from "../../../services/common/formatCurrency";
// import { LineChart } from "./LineChartDashBoard"; // Assuming you have a LineChartDashBoard component

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const customTableHeaderCellStyle = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

const dataBieuDo = [
  { label: "Nhẫn", value: 35 },
  { label: "Dây chuyền", value: 25 },
  { label: "Lắc tay", value: 15 },
  { label: "Bông tai", value: 10 },
];

const DashboardCard = function ({
  iconCart,
  title,
  total,
  product,
  order,
  orderCancel,
  orderReturn,
  color,
}: {
  iconCart:
    | typeof ScheduleOutlined
    | typeof RiseOutlined
    | typeof CalendarOutlined
    | typeof BarChartOutlined
    | typeof SettingOutlined
    | typeof DownloadOutlined;
  title: string;
  total: number;
  product: number;
  order: number;
  orderCancel: number;
  orderReturn: number;
  color: string;
}) {
  const IconComponent = iconCart;
  return (
    <Card style={{ padding: "16px", backgroundColor: color, color: "white" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          color: "black",
        }}
      >
        <IconComponent />
      </div>
      <Typography.Text
        style={{
          marginTop: "8px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "monospace",
          fontSize: "17px",
        }}
      >
        {title}
      </Typography.Text>
      <Typography.Title
        level={4}
        style={{
          marginTop: "8px",
          textAlign: "center",
          fontFamily: "monospace",
          fontWeight: "600",
        }}
      >
        {formatCurrency(total)}
      </Typography.Title>
      <table
        style={{
          marginTop: "8px",
          width: "100%",
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: "15px",
          color: "black",
        }}
      >
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn thành công</th>
            <th>Đơn hủy</th>
            <th>Đơn trả</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold" }}>{product}</td>
            <td style={{ fontWeight: "bold" }}>{order}</td>
            <td style={{ fontWeight: "bold" }}>{orderCancel}</td>
            <td style={{ fontWeight: "bold" }}>{orderReturn}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default function Dashboard() {
  const [indexButton, setIndexButton] = useState(1);
  const [nameButton, setNameButton] = useState("ngày");
  const [filter, setFilter] = useState({
    page: 1,
    size: 5,
  });

  const handleChangeButton = (indexButton: number, nameButton: string) => {
    setIndexButton(indexButton);
    setNameButton(nameButton);
  };

  const listBestSeller = [
    {
      img: "../src/assets/image/product/product-1.jpg",
      name: "p1",
      quantity: "1",
      price: "1",
      size: "1",
    },
    {
      img: "../src/assets/image/product/product-2.jpg",
      name: "p2",
      quantity: "2",
      price: "2",
      size: "2",
    },
    {
      img: "../src/assets/image/product/product-3.jpg",
      name: "p3",
      quantity: "3",
      price: "3",
      size: "3",
    },
    {
      img: "../src/assets/image/product/product-3.jpg",
      name: "p3",
      quantity: "3",
      price: "3",
      size: "3",
    },
  ];

  return (
    <div>
      {/* tên màn hình */}
      <BreadcrumbsCustom listLink={[]} nameHere={"Thống kê"} />

      {/* thống kê luôn hiển thị theo ngày, tuần, tháng , năm và tùy chỉnh */}
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col span={12}>
          <DashboardCard
            iconCart={ScheduleOutlined }
            title={"Hôm nay"}
            total={1}
            product={1}
            order={1}
            orderCancel={1}
            orderReturn={1}
            color={"#e3d7c3"}
          />
        </Col>
        <Col span={12}>
          <DashboardCard
            iconCart={RiseOutlined }
            title={"Tuần này"}
            total={1}
            product={1}
            order={1}
            orderCancel={1}
            orderReturn={1}
            color={"#e0ccab"}
          />
        </Col>
        <Col span={12}>
          <DashboardCard
            iconCart={CalendarOutlined}
            title={"Tháng này"}
            total={1}
            product={1}
            order={1}
            orderCancel={1}
            orderReturn={1}
            color={"#e0ccab"}
          />
        </Col>
        <Col span={12}>
          <DashboardCard
            iconCart={BarChartOutlined }
            title={"Năm nay"}
            total={1}
            product={1}
            order={1}
            orderCancel={1}
            orderReturn={1}
            color={"#e3d7c3"}
          />
        </Col>
        {indexButton === 5 && (
          <Col span={24}>
            <DashboardCard
              iconCart={SettingOutlined }
              title={"Tùy chỉnh"}
              total={1}
              product={1}
              order={1}
              orderCancel={1}
              orderReturn={1}
              color={"#e3d7c3"}
            />
          </Col>
        )}
      </Row>

      {/* bộ lọc (bộ filter) theo ngày tuần tháng năm */}
      <Card bordered={false}>
        <Title level={4} style={{ fontWeight: "bold", color: "#c29957" }}>
          Bộ lọc
        </Title>
        <div style={{ padding: "0 8px" }}>
          <Button
            style={{
              backgroundColor: indexButton === 1 ? "#c29957" : "white",
              borderColor: "#c29957",
              color: indexButton === 1 ? "white" : "#c29957",
              marginRight: "8px",
            }}
            onClick={() => handleChangeButton(1, "ngày")}
          >
            Ngày
          </Button>
          <Button
            style={{
              backgroundColor: indexButton === 2 ? "#c29957" : "white",
              borderColor: "#c29957",
              color: indexButton === 2 ? "white" : "#c29957",
              marginRight: "8px",
            }}
            onClick={() => handleChangeButton(2, "tuần")}
          >
            Tuần
          </Button>
          <Button
            style={{
              backgroundColor: indexButton === 3 ? "#c29957" : "white",
              borderColor: "#c29957",
              color: indexButton === 3 ? "white" : "#c29957",
              marginRight: "8px",
            }}
            onClick={() => handleChangeButton(3, "tháng")}
          >
            Tháng
          </Button>
          <Button
            style={{
              backgroundColor: indexButton === 4 ? "#c29957" : "white",
              borderColor: "#c29957",
              color: indexButton === 4 ? "white" : "#c29957",
              marginRight: "8px",
            }}
            onClick={() => handleChangeButton(4, "năm")}
          >
            Năm
          </Button>
          <Button
            style={{
              backgroundColor: indexButton === 5 ? "#c29957" : "white",
              borderColor: "#c29957",
              color: indexButton === 5 ? "white" : "#c29957",
              marginRight: "8px",
            }}
            onClick={() => handleChangeButton(5, "tùy chỉnh")}
          >
            Tùy chỉnh
          </Button>
          <Button
            icon={<DownloadOutlined />}
            style={{
              float: "right",
              backgroundColor: "white",
              color: "green",
              borderColor: "green",
            }}
          >
            Export to Excel
          </Button>
          {indexButton === 5 && (
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(_, value) => console.log(value)}
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{
                borderColor: "#c29957",
              }}
            />
          )}
        </div>

        {/*  danh sách sản phẩm bán chạy */}
        <Row gutter={16} style={{ padding: "0 8px" }}>
          <Col span={14}>
            <Title
              level={4}
              style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}
            >
              Danh sách sản phẩm bán chạy theo {nameButton}
            </Title>
            <Table
              components={{
                header: {
                  cell: (props:any) => (
                    <th {...props} style={customTableHeaderCellStyle} />
                  ),
                },
              }}
              dataSource={listBestSeller}
              pagination={false}
              columns={[
                {
                  title: "Ảnh",
                  dataIndex: "img",
                  key: "img",
                  width: "20%",
                  render: (text) => (
                    <img style={{ height: "70px" }} src={text} alt="error" />
                  ),
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: "name",
                  key: "name",
                  width: "30%",
                },
                {
                  title: "Số lượng",
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "center",
                  width: "10%",
                },
                {
                  title: "Giá tiền",
                  dataIndex: "price",
                  key: "price",
                  align: "center",
                  width: "30%",
                  render: (text) => formatCurrency(text),
                },
                {
                  title: "Kích cỡ",
                  dataIndex: "size",
                  key: "size",
                  align: "center",
                  width: "10%",
                },
              ]}
            />
            {listBestSeller.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "-5px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <div>
                  <span>Xem </span>
                  <Select
                    value={filter.size}
                    onChange={(value) => setFilter({ ...filter, size: value })}
                    style={{ width: 60, margin: "0 8px" }}
                    size="small"
                  >
                    <Option value={1}>1</Option>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={15}>15</Option>
                    <Option value={20}>20</Option>
                  </Select>
                  <span>sản phẩm</span>
                </div>
                <Pagination
                  size="small"
                  current={filter.page}
                  total={50} // call api = số lượng page * 10
                  onChange={(page) => setFilter({ ...filter, page })}
                />
              </div>
            )}
          </Col>

          {/*  biểu đồ trạng thái */}
          <Col span={10}>
            <Title
              level={4}
              style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}
            >
              Biểu đồ trạng thái {nameButton}
            </Title>
            <Card style={{ borderColor: "#c29957" }}>
              <PieChartDashBoard data={dataBieuDo} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
