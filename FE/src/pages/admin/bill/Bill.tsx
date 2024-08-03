import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Card,
  Col,
  Row,
  Table,
  Tabs,
  DatePicker,
  Tag,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { Link } from "react-router-dom";
import formatCurrency from "../../../services/common/formatCurrency";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import axios from "axios";
import dayjs from "dayjs";
import "./BillStyle.css";
import styleHoaDon from "../../../services/constants/styleHoaDon";
import { IBill } from "../../../interface/Bill";

interface IFilterBill {
  code: string | null;
  createAtFrom: string | null;
  createAtTo: string | null;
  status: string;
  page: number;
}

interface IDateSearch {
  createAtFrom: string;
  createAtTo: string;
}

export default function Bill() {
  const [valueTabHD, setValueTabHD] = useState<string>("");
  const [totalBill, setTotalBill] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [codeSearch, setCodeSearch] = useState<string>("");
  const [dateSearch, setDateSearch] = useState<IDateSearch>({
    createAtFrom: "",
    createAtTo: "",
  });
  const [filter, setFilter] = useState<IFilterBill>({
    code: "",
    createAtFrom: "",
    createAtTo: "",
    status: valueTabHD,
    page: 1,
  });
  const [listBill, setListBill] = useState<IBill[]>([]);

  const fetchOrder = async (filter: IFilterBill, currentPage: number) => {
    try {
      const response = await axios.post("http://localhost:3001/api/bills", {
        ...filter,
        page: currentPage,
      });
      setListBill(response.data?.data);
      setTotalBill(response.data?.total);
      setPageSize(response.data?.size);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOrder(filter, currentPage);
  }, [filter, currentPage]);

  const handleChangeTab = (newValue: string) => {
    setValueTabHD(newValue);
    setFilter({ ...filter, status: newValue });
  };

  const handleFilter = (codeSearch: string, dateSearch: IDateSearch) => {
    setFilter({
      ...filter,
      code: codeSearch,
      createAtFrom: dateSearch.createAtFrom,
      createAtTo: dateSearch.createAtTo,
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      align: "center" as const,
      render: (_: string, __: IBill, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      align: "center" as const,
      width: "15%",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      align: "center" as const,
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center" as const,
      width: "10%",
      render: (text: number) => formatCurrency({ money: String(text) }),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      width: "10%",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "10%",
      render: (text: string) => (
        <Tag className={styleHoaDon({ status: text })}>
          {statusHoaDon({ status: text })}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      align: "center" as const,
      width: "10%",
      render: (bill: IBill) => (
        <Link to={`/admin/bill/detail/${bill?._id}`}>
          <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
        </Link>
      ),
    },
  ];

  const listSttHD = ["1", "2", "3", "4", "5", "6", "7", "8", "0"];

  return (
    <div className="bill-container">
      <BreadcrumbsCustom listLink={[]} nameHere={"Đơn hàng"} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={10}>
            <Input
              id="hd-input-search"
              style={{
                width: "100%",
                borderColor: "#c29957",
                fontFamily: "PlayFair",
              }}
              size="middle"
              placeholder="Tìm kiếm hoá đơn theo mã hóa đơn"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              onChange={(e) => setCodeSearch(e.target.value)}
            />
          </Col>
          <Col span={5}>
            <span
              style={{
                marginRight: "10px",
                fontFamily: "PlayFair",
                fontSize: "15px",
              }}
            >
              Từ ngày
            </span>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(e) =>
                setDateSearch({
                  ...dateSearch,
                  createAtFrom: e ? dayjs(e).format("YYYY-MM-DD") : "",
                })
              }
            />
          </Col>
          <Col span={5}>
            <span
              style={{
                marginRight: "10px",
                fontFamily: "PlayFair",
                fontSize: "15px",
              }}
            >
              Đến ngày
            </span>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(e) =>
                setDateSearch({
                  ...dateSearch,
                  createAtTo: e ? dayjs(e).format("YYYY-MM-DD") : "",
                })
              }
            />
          </Col>
          <Col span={2}></Col>
          <Col span={2}>
            <Button
              type="default"
              icon={<SearchOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
                fontFamily: "PlayFair",
                fontSize: "15px",
              }}
              onClick={() => handleFilter(codeSearch, dateSearch)}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: "12px" }} >
        <Tabs activeKey={valueTabHD} onChange={handleChangeTab}>
          <TabPane tab="Tất cả" key="" />
          {listSttHD.map((row) => (
            <TabPane tab={statusHoaDon({ status: String(row) })} key={row} />
          ))}
        </Tabs>
        <Table
          className="status-bill"
          dataSource={listBill}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalBill,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
}
