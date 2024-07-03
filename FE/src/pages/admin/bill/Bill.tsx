import { useEffect, useState } from "react";
import {
  DatePicker,
  Button,
  Input,
  Card,
  Col,
  Row,
  Table,
  Tabs,
  Modal,
} from "antd";
import {
  SearchOutlined,
  PlusSquareOutlined,
  DownloadOutlined,
  ScanOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import Scanner from "./Scanner";
import { Link } from "react-router-dom";
import formatCurrency from "../../../services/common/formatCurrency";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import { IOrder } from "../../../interface/Orders";
import axios from "axios";

const { RangePicker } = DatePicker;



export default function Bill() {
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [valueTabHD, setValueTabHD] = useState<string>("all");

  const [bills, setBills] = useState<IOrder[]>([]);
  useEffect(() =>{
    const fetchOrder = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/orders");
        setBills(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrder();
  }, [])

  const scanQr = () => {};
  const handleChangeTab = (newValue: string) => {
    setValueTabHD(newValue);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "20%",
      align: "center" as const,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      align: "center" as const,
      width: "30%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center" as const,
      width: "30%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      align: "center" as const,
      width: "30%",
      render: (text: string) => formatCurrency({ money: text }),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      width: "30%",
    },
    {
      title: "Trạng thái",
      dataIndex: "st",
      key: "st",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Hành động",
      align: "center" as const,
      width: "10%",
      render: (bill: BillItem) => (
        <Link to={`/admin/bill/detail/${bill?.key}`}>
          <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
        </Link>
      ),
    },
  ];

  const data = bills.map((item: IOrder, index: number) => {
    return {
      stt: index + 1,
      key: item._id,
      customerName: item.customerName,
      productName: item.products.name,
      quantity: item.products.length,
      price : item.totalPrice,
      createdAt : item.createdAt,
    };
  });

  const listSttHD = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Đơn hàng"} />
      <Modal
        visible={qrScannerVisible}
        onCancel={() => setQrScannerVisible(false)}
        footer={null}
      >
        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 24px rgba(0, 0, 0, 0.2)",
            padding: 16,
          }}
        >
          <Scanner handleScan={scanQr} setOpen={setQrScannerVisible} />
        </div>
      </Modal>
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm hoá đơn theo mã hóa đơn"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
            />
          </Col>
          <Col span={12}>
            <Button
              icon={<DownloadOutlined />}
              style={{
                float: "right",
                marginLeft: "12px",
                backgroundColor: "white",
                color: "green",
                borderColor: "green",
              }}
              type="default"
            >
              Export Excel
            </Button>
            <Button
              style={{
                float: "right",
                marginLeft: "12px",
                borderColor: "#c29957",
                color: "#c29957",
              }}
              onClick={() => {
                setQrScannerVisible(true);
              }}
              type="default"
              icon={<ScanOutlined />}
            >
              Quét mã
            </Button>
            <Button
              type="default"
              icon={<PlusSquareOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
              }}
            >
              Tạo hoá đơn
            </Button>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={12}>
            <span>Thời gian: </span>
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(_, dateStrings) => console.log(dateStrings)}
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{
                borderColor: "#c29957",
              }}
            />
            <Button
              type="default"
              icon={<SearchOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
              }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: "12px" }}>
        <Tabs activeKey={valueTabHD} onChange={handleChangeTab}>
          <TabPane tab="Tất cả" key="all"></TabPane>
          {listSttHD.map((row) => (
            <TabPane tab={statusHoaDon({ status: row })} key={row}></TabPane>
          ))}
        </Tabs>
        <Table dataSource={data} columns={columns} />
      </Card>
    </div>
  );
}
