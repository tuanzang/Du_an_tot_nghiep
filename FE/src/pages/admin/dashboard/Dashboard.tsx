import React, { useEffect, useState } from "react";
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

import formatCurrency from "../../../services/common/formatCurrency";
import axios from "axios";
import PieChartDashBoard from "./PieChartDashBoard";
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

const DashboardCard = function ({
  iconCart,
  title,
  total,
  product,
  order,
  orderCancel,
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
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default function Dashboard() {
  const [indexButton, setIndexButton] = useState(1);
  const [nameButton, setNameButton] = useState("ngày");
  const [dataBieuDo, setDataBieuDo] = useState([]);
  const [listBestSeller, setListBestSeller] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    size: 5,
  });
  

  const [listOrder, setListOrder] = useState([]);
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalOrdersThisWeek, setTotalOrdersThisWeek] = useState(0);
  const [totalOrdersThisMonth, setTotalOrdersThisMonth] = useState(0);
  const [totalOrdersThisYear, setTotalOrdersThisYear] = useState(0);
  const [completedOrdersDay, setCompletedOrdersDay] = useState(0);
  const [canceledOrdersDay, setCanceledOrdersDay] = useState(0);
  const [completedOrdersWeek, setCompletedOrdersWeek] = useState(0);
  const [canceledOrdersWeek, setCanceledOrdersWeek] = useState(0);
  const [completedOrdersMonth, setCompletedOrdersMonth] = useState(0);
  const [canceledOrdersMonth, setCanceledOrdersMonth] = useState(0);
  const [completedOrdersYear, setCompletedOrdersYear] = useState(0);
  const [canceledOrdersYear, setCanceledOrdersYear] = useState(0);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        // tính tuần

        // Lấy tổng số đơn hàng
        const resAllOrders = await axios.get(`http://localhost:3001/api/orders`);
        const allOrders = resAllOrders.data.data;
        console.log(allOrders);

        setListOrder(allOrders);

        // Tính tổng số đơn hàng thành công và bị hủy theo ngày
        const resOrdersByDay = await getOrdersByDayStatus(today);
        setTotalOrdersToday(resOrdersByDay.orderByDay);
        setCompletedOrdersDay(resOrdersByDay.completed);
        setCanceledOrdersDay(resOrdersByDay.canceled);

        // Tính tổng số đơn hàng thành công và bị hủy theo tuần
        const resOrdersByWeek = await getOrdersByWeekStatus();
        setTotalOrdersThisWeek(resOrdersByWeek.orderByWeek);
        setCompletedOrdersWeek(resOrdersByWeek.completed);
        setCanceledOrdersWeek(resOrdersByWeek.canceled);

        // Tính tổng số đơn hàng thành công và bị hủy theo tháng
        const resOrdersByMonth = await getOrdersByMonthStatus();
        setTotalOrdersThisMonth(resOrdersByMonth.orderByMonth);
        setCompletedOrdersMonth(resOrdersByMonth.completed);
        setCanceledOrdersMonth(resOrdersByMonth.canceled);

        // Tính tổng số đơn hàng thành công và bị hủy theo năm
        const resOrdersByYear = await getOrdersByYearStatus();
        setTotalOrdersThisYear(resOrdersByYear.orderByYear);
        setCompletedOrdersYear(resOrdersByYear.completed);
        setCanceledOrdersYear(resOrdersByYear.canceled);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllOrders();
  }, []);

  
  const getOrdersByDayStatus = async (date = new Date().toISOString().split('T')[0]) => {
    try {
      const resAllOrdersByDay = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          dateNow: date,
        }
      })
      const resCompleted = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "7",
          dateNow: date,
        },
      });

      const resCanceled = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "0",
          dateNow: date,
        },
      });

      console.log(date);
      return {
        orderByDay: resAllOrdersByDay.data.data.length,
        completed: resCompleted.data.data.length,
        canceled: resCanceled.data.data.length,
      };
    } catch (error) {
      console.log(error);
      return {
        completed: 0,
        canceled: 0,
      };
    }
  };

  const getOrdersByWeekStatus = async () => {
    try {
      const { startDate, endDate } = getWeekRange();
      const resAllOrdersByWeek = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,

        }

      })
      // console.log(startDate, endDate);


      const resCompleted = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "7",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });

      const resCanceled = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "0",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });

      return {
        orderByWeek: resAllOrdersByWeek.data.data.length,
        completed: resCompleted.data.data.length,
        canceled: resCanceled.data.data.length,
      };
    } catch (error) {
      console.log(error);
      return {
        completed: 0,
        canceled: 0,
      };
    }
  };

  const getWeekRange = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));

    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
    };
  };

  const getOrdersByMonthStatus = async () => {
    try {
      const { startDate, endDate } = getMonthRange();
      const resAllOrdersByMonth = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      const resCompleted = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "7",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });

      const resCanceled = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "0",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });

      return {
        orderByMonth: resAllOrdersByMonth.data.data.length,
        completed: resCompleted.data.data.length,
        canceled: resCanceled.data.data.length,
      };
    } catch (error) {
      console.log(error);
      return {
        completed: 0,
        canceled: 0,
      };
    }
  };

  const getMonthRange = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
    };
  };

  const getOrdersByYearStatus = async () => {
    try {
      const { startDate, endDate } = getYearRange();
      const resAllOrdersByYear = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      const resCompleted = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "7",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });

      const resCanceled = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "0",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });

      return {
        orderByYear: resAllOrdersByYear.data.data.length,
        completed: resCompleted.data.data.length,
        canceled: resCanceled.data.data.length,
      };
    } catch (error) {
      console.log(error);
      return {
        completed: 0,
        canceled: 0,
      };
    }
  };

  const getYearRange = () => {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

    return {
      startDate: startOfYear.toISOString().split('T')[0],
      endDate: endOfYear.toISOString().split('T')[0],
    };
  };

  // const fetchBestSellers = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/api/best-sellers");
  //     setListBestSeller(response.data.data); // Giả sử API trả về dữ liệu ở data.data
  //   } catch (error) {
  //     console.error("Error fetching best sellers:", error);
  //     setListBestSeller([]); // Reset nếu có lỗi
  //   }
  // };
 
  
  const handleChangeButton = async (index, period) => {
    setIndexButton(index);
    setNameButton(period);
    let data;

    switch (index) {
      case 1:
        data = await getOrdersByDayStatus(new Date().toISOString().split('T')[0]);
        break;
      case 2:
        data = await getOrdersByWeekStatus();
        break;
      case 3:
        data = await getOrdersByMonthStatus();
        break;
      case 4:
        data = await getOrdersByYearStatus();
        break;
      default:
        return;
    }

    setDataBieuDo([
      { label: "Đã hoàn thành", value: data.completed },
      { label: "Đã hủy", value: data.canceled },
    ]);
  };

  useEffect(() => {
    handleChangeButton(indexButton, nameButton);
    // fetchBestSellers();
  }, []);

  const getDataForButton = () => {
    switch (indexButton) {
      case 1:
        return {
          title: "Hôm nay",
          total: totalOrdersToday,
          completed: completedOrdersDay,
          canceled: canceledOrdersDay,
          color: "#e3d7c3",
        };
      case 2:
        return {
          title: "Tuần này",
          total: totalOrdersThisWeek,
          completed: completedOrdersWeek,
          canceled: canceledOrdersWeek,
          color: "#e0ccab",
        };
      case 3:
        return {
          title: "Tháng này",
          total: totalOrdersThisMonth,
          completed: completedOrdersMonth,
          canceled: canceledOrdersMonth,
          color: "#e0ccab",
        };
      case 4:
        return {
          title: "Năm nay",
          total: totalOrdersThisYear,
          completed: completedOrdersYear,
          canceled: canceledOrdersYear,
          color: "#e3d7c3",
        };
      default:
        return {};
    }
  };

  const dataForButton = getDataForButton();
  return (
    <div>
      {/* tên màn hình */}
      <BreadcrumbsCustom listLink={[]} nameHere={"Thống kê"} />

      {/* bộ lọc */}
      <Card bordered={false}>
        <Title level={4} style={{ fontWeight: "bold", color: "#c29957" }}>Bộ lọc</Title>
        <div style={{ padding: "0 8px" }}>
          {['ngày', 'tuần', 'tháng', 'năm', 'tùy chỉnh'].map((type, index) => (
            <Button
              key={type}
              style={{
                backgroundColor: indexButton === index + 1 ? "#c29957" : "white",
                borderColor: "#c29957",
                color: indexButton === index + 1 ? "white" : "#c29957",
                marginRight: "8px",
              }}
              onClick={() => handleChangeButton(index + 1, type)}
            >
              {type}
            </Button>
          ))}
          {indexButton === 5 && (
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(_, value) => console.log(value)}
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{ borderColor: "#c29957" }}
            />
          )}
        </div>
        <Row gutter={16} style={{ padding: "0 8px" }}>
          <Col span={24}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Thống kê theo {['ngày', 'tuần', 'tháng', 'năm', 'tùy chỉnh'][indexButton - 1]}
            </Title>
            <Table
              dataSource={[dataForButton]}
              columns={[
                { title: "Thời gian", dataIndex: "title", key: "title" },
                { title: "Tổng đơn hàng", dataIndex: "total", key: "total" },
                { title: "Đơn hoàn thành", dataIndex: "completed", key: "completed" },
                { title: "Đơn hủy", dataIndex: "canceled", key: "canceled" },
              ]}
              pagination={false}
            />
          </Col>
          <Col span={24}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Danh sách sản phẩm bán chạy theo {['ngày', 'tuần', 'tháng', 'năm', 'tùy chỉnh'][indexButton - 1]}
            </Title>
            <Table
              dataSource={listBestSeller}
              pagination={false}
              columns={[
                { title: "Ảnh", dataIndex: "img", key: "img", render: (text) => <img style={{ height: "70px" }} src={text} alt="error" /> },
                { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
                { title: "Số lượng", dataIndex: "quantity", key: "quantity", align: "center" },
                { title: "Giá tiền", dataIndex: "price", key: "price", align: "center", render: (text) => formatCurrency(text) },
                { title: "Kích cỡ", dataIndex: "size", key: "size", align: "center" },
              ]}
            />
            {listBestSeller.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "-5px", paddingTop: "10px", paddingBottom: "10px" }}>
                <div>
                  <span>Xem </span>
                  <Select
                    value={filter.size}
                    onChange={(value) => setFilter({ ...filter, size: value })}
                    style={{ width: 60, margin: "0 8px" }}
                    size="small"
                  >
                    {[1, 5, 10, 15, 20].map(size => <Option key={size} value={size}>{size}</Option>)}
                  </Select>
                  <span>sản phẩm</span>
                </div>
                <Pagination
                  size="small"
                  current={filter.page}
                  total={50}
                  onChange={(page) => setFilter({ ...filter, page })}
                />
              </div>
            )}
          </Col>
          <Col span={24}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Biểu đồ trạng thái {['ngày', 'tuần', 'tháng', 'năm', 'tùy chỉnh'][indexButton - 1]}
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

