import { Col, Empty, Row, Table, Tabs, Tag, Typography } from "antd";
import ProfileMenu from "./ProfileMenu";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import { IUser } from "../../../interface/Users";
import { IBill } from "../../../interface/Bill";
import formatCurrency from "../../../services/common/formatCurrency";
import dayjs from "dayjs";
import styleHoaDon from "../../../services/constants/styleHoaDon";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileBill() {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  // bill
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      align: "center" as const,
      render: (_: string, __: IBill, index: number) => index + 1,
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
        <Link to={`/profile/bill/detail/${bill?._id}`}>
          <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
        </Link>
      ),
    },
  ];

  const listSttHD = ["1", "2", "3", "4", "5", "6", "7", "0"];

  const [valueTabHD, setValueTabHD] = useState<string>("");
  const [totalBill, setTotalBill] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [listBill, setListBill] = useState<IBill[]>([]);

  const fetchOrder = async (
    status: string,
    user: IUser | null,
    currentPage: number
  ) => {
    if (user === null) {
      return;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/bills/byUserId",
          {
            status: status,
            userId: user._id,
            page: currentPage,
          }
        );
        setListBill(response.data?.data);
        setTotalBill(response.data?.total);
        setPageSize(response.data?.size);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchOrder(valueTabHD, user, currentPage);
  }, [valueTabHD, user, currentPage]);

  const handleChangeTab = (newValue: string) => {
    setValueTabHD(newValue);
  };
  return (
    <div>
      {/* breadcrumb area start */}
      <div className="breadcrumb-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumb-wrap">
                <nav aria-label="breadcrumb">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/home">
                        <i className="fa fa-home"></i>
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <a href="/home">Trang chủ</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Tài khoản của tôi
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb area end */}

      {user ? (
        <div
          className="container"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Đơn hàng của tôi
              </Typography.Title>
              <Tabs activeKey={valueTabHD} onChange={handleChangeTab}>
                <TabPane tab="Tất cả" key="" />
                {listSttHD.map((row) => (
                  <TabPane
                    tab={statusHoaDon({ status: String(row) })}
                    key={row}
                  />
                ))}
              </Tabs>
              <Table
                dataSource={listBill}
                columns={columns}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalBill,
                  onChange: (page) => setCurrentPage(page),
                }}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="container">
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Đơn hàng của tôi
              </Typography.Title>
              <Empty />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
