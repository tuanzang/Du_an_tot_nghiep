import React from "react";
import { Tabs, Table, Layout, Row, Col, Typography, Button } from "antd";
import { Image } from "antd";
import "./Orderhistory.css";

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title } = Typography;

interface OrderData {
  key: string;
  stt: string;
  maHoaDon: string;
  hinhAnh: string; // Thêm trường hình ảnh
  tenSanPham: string;
  soLuong: string;
  tongTien: string;
  ngayDatHang: string;
  trangThai: string;
  trangThaiClass: string;
}

// Cấu hình các cột của bảng
const columns = [
  { title: "STT", dataIndex: "stt", key: "stt" },
  { title: "Mã hóa đơn", dataIndex: "maHoaDon", key: "maHoaDon" },
  {
    title: "Hình ảnh", // Thêm cột hình ảnh
    dataIndex: "hinhAnh",
    key: "hinhAnh",
    render: (text: string) => <Image width={100} src={text} />,
  },
  { title: "Tên sản phẩm", dataIndex: "tenSanPham", key: "tenSanPham" },
  {
    title: "Số lượng",
    dataIndex: "soLuong",
    key: "soLuongSanPham",
  },
  { title: "Tổng tiền", dataIndex: "tongTien", key: "tongTien" },
  {
    title: "Trạng thái",
    dataIndex: "trangThai",
    key: "trangThai",
    render: (text: string, record: OrderData) => (
      <span className={record.trangThaiClass}>{text}</span>
    ),
  },
];

// Dữ liệu mẫu cho bảng
const data: OrderData[] = [
  {
    key: "1",
    stt: "01",
    maHoaDon: "001",
    hinhAnh: "https://via.placeholder.com/100",
    tenSanPham: "Sản phẩm A",
    soLuong: "2",
    tongTien: "200,000 VND",
    ngayDatHang: "2023-07-01",
    trangThai: "Hoàn thành",
    trangThaiClass: "hoan-thanh",
  },
  {
    key: "2",
    stt: "02",
    maHoaDon: "002",
    hinhAnh:
      "https://cdn.pnj.io/images/detailed/211/sp-gnxmxmw005162-nhan-vang-trang-14k-dinh-da-ecz-pnj-2.png",
    tenSanPham: "Sản phẩm B",
    soLuong: "1",
    tongTien: "100,000 VND",
    ngayDatHang: "2023-07-02",
    trangThai: "Chờ xác nhận",
    trangThaiClass: "cho-xac-nhan",
  },
  {
    key: "3",
    stt: "03",
    maHoaDon: "003",
    hinhAnh: "https://via.placeholder.com/100",
    tenSanPham: "Sản phẩm C",
    soLuong: "3",
    tongTien: "300,000 VND",
    ngayDatHang: "2023-07-03",
    trangThai: "Đang vận chuyển",
    trangThaiClass: "dang-van-chuyen",
  },
];

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>
        <Row style={{ paddingTop: "50px" }}>
          <Col
            xs={24}
            sm={22}
            md={20}
            lg={20}
            xl={20}
            style={{ textAlign: "left" }} // Căn trái
          >
            <Title level={2} className="text-center text-danger">
              Đơn hàng của bạn
            </Title>

            <div className="center-container">
              <div className="ant-table-wrapperr">
                <Tabs defaultActiveKey="hoan-thanh" centered>
                  <TabPane tab="Tất cả" key="tat-ca">
                    <Table
                      columns={columns}
                      dataSource={data}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                  <TabPane tab="Chờ xác nhận" key="cho-xac-nhan">
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (item) => item.trangThai === "Chờ xác nhận"
                      )}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                  <TabPane tab="Đang vận chuyển" key="dang-van-chuyen">
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (item) => item.trangThai === "Đang vận chuyển"
                      )}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                  <TabPane tab="Đã giao hàng" key="da-giao-hang">
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (item) => item.trangThai === "Đã giao hàng"
                      )}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                  <TabPane tab="Chờ thanh toán" key="cho-thanh-toan">
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (item) => item.trangThai === "Chờ thanh toán"
                      )}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                  <TabPane tab="Đã thanh toán" key="da-thanh-toan">
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (item) => item.trangThai === "Đã thanh toán"
                      )}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                  <TabPane tab="Hoàn thành" key="hoan-thanh">
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (item) => item.trangThai === "Hoàn thành"
                      )}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                  <TabPane tab="Đã hủy" key="da-huy">
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (item) => item.trangThai === "Đã hủy"
                      )}
                      locale={{ emptyText: "Không có dữ liệu" }}
                      size="large"
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
