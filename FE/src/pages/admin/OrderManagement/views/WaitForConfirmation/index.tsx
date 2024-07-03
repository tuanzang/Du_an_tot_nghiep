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
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusSquareOutlined,
  DownloadOutlined,
  ScanOutlined,
  EyeOutlined,
} from "@ant-design/icons";
// import TabPane from "antd/es/tabs/TabPane";
import { Link } from "react-router-dom";

import axios from "axios";
import BreadcrumbsCustom from "../../../../../components/BreadcrumbsCustom";
import Scanner from "../../../bill/Scanner";
import { IOrder } from "../../../../../interface/Orders";
import { log } from "console";
import formatCurrency from "../../../../../services/common/formatCurrency";
import formatDate from "../../../../../services/common/formatDate";
import { render } from "react-dom";
const { RangePicker } = DatePicker;


const columns = ({formatCurrency: any,  currentPage, pageSize}) =>[
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: "30",
    align: "center" as const,
    render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
  },
  {
    title: "Tên khách hàng",
    dataIndex: "customerName",
    key: "customerName",
    align: "center" as const,
    width: "30%",
  },
  {
    title: "Giá tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
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
    render: (value: any) => {
      return formatDate(value);
    }
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    align: "center" as const,
    width: "10%",
    render: (value: any) => {
      const status = value
      switch (status) {
        case "Chờ xác nhận":
          return <Tag color="warning">{status}</Tag>;
        case "Chờ giao hàng":
          return <Tag color="processing">{status}</Tag>;
        case "Đang vận chuyển":
          return <Tag color="processing">{status}</Tag>;
        case "Đã giao hàng":
          return <Tag color="success">{status}</Tag>;
        case "Đã thanh toán":
          return <Tag color="success">{status}</Tag>;
        case "Chờ thanh toán":
          return <Tag color="warning">{status}</Tag>;
        case "Hoàn thành":
          return <Tag color="success">{status}</Tag>;
        case "Đã hủy":
          return <Tag color="warning">{status}</Tag>;
        case "Đặt hàng thành công":
          return <Tag color="success">{status}</Tag>;
        default:
          <Tag color="default">{status}</Tag>
          return null;
      }
    }
  },
  // {
  //   title: "Hành động",
  //   align: "center" as const,
  //   width: "10%",
  //   render: (bill: BillItem) => (
  //     <Link to={`/admin/bill/detail/${bill?.key}`}>
  //       <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
  //     </Link>
  //   ),
  // },
];
export default function AllOrder() { 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listOrder, setListOrder] = useState([]);
   
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const getListOrder = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/orders", {
        params: {
          status: "Chờ xác nhận",
        }
      });
      setListOrder(res.data.data);
      console.log(res.data.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => { 
    getListOrder();
  }, []);

  return (
    <div>
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
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: "12px" }}>
        
        <Table dataSource={listOrder} columns={columns({formatCurrency, currentPage, pageSize})}   onChange={handleTableChange} />
      </Card>
    </div>
  );
}
