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


import axios from "axios";
import formatCurrency from "../../../services/common/formatCurrency";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import { IProduct } from "../../../interface/Products";
import { log } from "console";
import { GiLogicGateAnd } from "react-icons/gi";
import { start } from "repl";
import PieChartDashBoard from "./PieChartDashBoard";
// import { LineChart } from "./LineChartDashBoard"; // Assuming you have a LineChartDashBoard component

const { Title } = Typography;
const { RangePicker } = DatePicker;
interface Filter {
  page: number;
  size: number;
  createAtFrom?: string | null; // Thêm thuộc tính này
  createAtTo?: string | null;   // Thêm thuộc tính này
}

interface ProductDetails {
  price: number;
  image: string;
  description?: string;
}

interface BestSellerItem {
  stt: number;
  name: string;
  productDetails: ProductDetails;
  categoryName: string;
  totalQuantity: number;
}

export default function Dashboard() {
  const [dataBieuDo, setDataBieuDo] = useState([]);
  const [indexButton, setIndexButton] = useState(1);
  const [nameButton, setNameButton] = useState("ngày");
  const [totalPriceByDay, setTotalPriceByDay] = useState(0);
  const [totalPriceByWeek, setTotalPriceByWeek] = useState(0);
  const [totalPriceByMonth, setTotalPriceByMonth] = useState(0);
  const [totalPriceByYear, setTotalPriceByYear] = useState(0);
  const [totalPriceByCustomDay, setTotalPriceByCustomDay] = useState(0);
  const [listBestSellerByDay, setListBestSellerByDay] = useState([]);
  const [listBestSellerByWeek, setListBestSellerByWeek] = useState([]);
  const [listBestSellerByMonth, setListBestSellerByMonth] = useState([]);
  const [listBestSellerByYear, setListBestSellerByYear] = useState([]);
  const [listBestSellerByCustomDay, setListBestSellerByCustomDay] = useState([]);
  const [filter, setFilter] = useState<Filter>({ page: 1, size: 5, createAtFrom: null, createAtTo: null });
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalOrdersThisWeek, setTotalOrdersThisWeek] = useState(0);
  const [totalOrdersThisMonth, setTotalOrdersThisMonth] = useState(0);
  const [totalOrdersThisYear, setTotalOrdersThisYear] = useState(0);
  const [totalOrdersByCustomDay, setTotalOrdersByCustomDay] = useState(0);
  const [completedOrdersByCustomDay, setCompletedOrdersByCustomDay] = useState(0);
  const [canceledOrdersByCustomDay, setCanceledOrdersByCustomDay] = useState(0);
  const [completedOrdersDay, setCompletedOrdersDay] = useState(0);
  const [canceledOrdersDay, setCanceledOrdersDay] = useState(0);
  const [completedOrdersWeek, setCompletedOrdersWeek] = useState(0);
  const [canceledOrdersWeek, setCanceledOrdersWeek] = useState(0);
  const [completedOrdersMonth, setCompletedOrdersMonth] = useState(0);
  const [canceledOrdersMonth, setCanceledOrdersMonth] = useState(0);
  const [completedOrdersYear, setCompletedOrdersYear] = useState(0);
  const [canceledOrdersYear, setCanceledOrdersYear] = useState(0);

  //tính tổng tiền 
  const getOrdersPriceByDayStatus = async (date = new Date().toISOString().split('T')[0]) => {
    try {
      const resTotalPriceByDay = await axios.get(`http://localhost:3001/api/orders/total-price/day`, {
        params: { dateNow: date }
      });

      setTotalPriceByDay(resTotalPriceByDay.data.totalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersPriceByWeekStatus = async () => {
    try {
      const { startDate, endDate } = getWeekRange();
      const resTotalPriceByWeek = await axios.get(`http://localhost:3001/api/orders/total-price/week`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate
        }
      });
      console.log(resTotalPriceByWeek.data.totalPrice);
      setTotalPriceByWeek(resTotalPriceByWeek.data.totalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersPriceByMonthStatus = async () => {
    try {
      const { startDate, endDate } = getMonthRange();
      const resTotalPriceByMonth = await axios.get(`http://localhost:3001/api/orders/total-price/month`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate
        }
      });

      setTotalPriceByMonth(resTotalPriceByMonth.data.totalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersPriceByYearStatus = async () => {
    try {
      const { startDate, endDate } = getYearRange();
      const resTotalPriceByYear = await axios.get(`http://localhost:3001/api/orders/total-price/year`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate
        }
      });

      setTotalPriceByYear(resTotalPriceByYear.data.totalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersByCustomDayStatus = async () => {
    try {
      const [startDate, endDate] = customDateRange;
      const resTotalPriceByCustomDay = await axios.get(`http://localhost:3001/api/orders/total-price/custom-day`, {
        params: {
          dateStart: startDate.format('YYYY-MM-DD'),
          dateEnd: endDate.format('YYYY-MM-DD')
        }
      });
      console.log(resTotalPriceByCustomDay.data.totalPrice);
      setTotalPriceByCustomDay(resTotalPriceByCustomDay.data.totalPrice);
    } catch (error) {
      console.log(error);
    }
  };


  // tính số đơn hàng
  const getOrdersByCustomStatus = async (createAtFrom: string, createAtTo: string) => {
    try {
      // Chuyển đổi ngày về định dạng YYYY-MM-DD
      const formattedCreateAtFrom = new Date(createAtFrom).toISOString().split('T')[0];
      const formattedCreateAtTo = new Date(createAtTo).toISOString().split('T')[0];

      const resAllOrdersByCustomDay = await axios.post("http://localhost:3001/api/orders", {
        createAtFrom: formattedCreateAtFrom,
        createAtTo: formattedCreateAtTo,
        ...customDateRange,
      });

      const resCompleted = await axios.post("http://localhost:3001/api/orders", {
        createAtFrom: formattedCreateAtFrom,
        createAtTo: formattedCreateAtTo,
        status: "7",
        ...customDateRange,
      });

      const resCanceled = await axios.post("http://localhost:3001/api/orders", {
        createAtFrom: formattedCreateAtFrom,
        createAtTo: formattedCreateAtTo,
        status: "0",
        ...customDateRange,
      });


      setTotalOrdersByCustomDay(resAllOrdersByCustomDay.data.data.length);
      setCompletedOrdersByCustomDay(resCompleted.data.data.length);
      setCanceledOrdersByCustomDay(resCanceled.data.data.length);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        totalOrdersByCustomDay: 0,
        completedOrdersByCustomDay: 0,
        canceledOrdersByCustomDay: 0,
      };
    }
  };
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
      setTotalOrdersToday(resAllOrdersByDay.data.data.length);
      setCompletedOrdersDay(resCompleted.data.data.length);
      setCanceledOrdersDay(resCanceled.data.data.length);
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

      setTotalOrdersThisWeek(resAllOrdersByWeek.data.data.length);
      setCompletedOrdersWeek(resCompleted.data.data.length);
      setCanceledOrdersWeek(resCanceled.data.data.length);
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

      setTotalOrdersThisMonth(resAllOrdersByMonth.data.data.length);
      setCompletedOrdersMonth(resCompleted.data.data.length);
      setCanceledOrdersMonth(resCanceled.data.data.length);
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

      setTotalOrdersThisYear(resAllOrdersByYear.data.data.length);
      setCompletedOrdersYear(resCompleted.data.data.length);
      setCanceledOrdersYear(resCanceled.data.data.length);
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
  const handleCustomDateRangeChange = (dates) => {
    setCustomDateRange(dates);
    if (dates[0] && dates[1]) {
      const startDate = dates[0].toISOString();
      const endDate = dates[1].toISOString();
      getOrdersByCustomStatus(startDate, endDate);
    }
    if (dates && dates.length === 2) {
      setCustomDateRange(dates);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString();
    getOrdersByCustomStatus(today, today);
    handleChangeButton(indexButton, nameButton);
  }, []);

  const getDataForButton = () => {
    switch (indexButton) {
      case 1:
        return {
          total: totalOrdersToday,
          completed: completedOrdersDay,
          canceled: canceledOrdersDay,
          totalPrice: totalPriceByDay,
          color: "#e3d7c3",
        };
      case 2:
        return {
          total: totalOrdersThisWeek,
          completed: completedOrdersWeek,
          canceled: canceledOrdersWeek,
          totalPrice: totalPriceByWeek,
          color: "#e0ccab",
        };
      case 3:
        return {
          total: totalOrdersThisMonth,
          completed: completedOrdersMonth,
          canceled: canceledOrdersMonth,
          totalPrice: totalPriceByMonth,
          color: "#e0ccab",
        };
      case 4:
        return {
          total: totalOrdersThisYear,
          completed: completedOrdersYear,
          canceled: canceledOrdersYear,
          totalPrice: totalPriceByYear,
          color: "#e3d7c3",
        };
      case 5:
        return {
          total: totalOrdersByCustomDay,
          completed: completedOrdersByCustomDay,
          canceled: canceledOrdersByCustomDay,
          totalPrice: totalPriceByCustomDay,
          color: "#e0ccab",
        }
      default:
        return {};
    }
  };

  const dataForButton = getDataForButton();

  // Sản phẩm được bán chạy nhất 
  const getListBestSellerByDay = async (date = new Date().toISOString().split('T')[0]) => {
    try {
      const allListBestSellerByDay = await axios.get(`http://localhost:3001/api/topOrder/top-ordered-products`, {
        params: {
          startDate: date
        }
      }
      );
      setListBestSellerByDay(allListBestSellerByDay.data.data);
      console.log(allListBestSellerByDay.data.data);

    } catch (error) {
      console.log(error);
    }
  }
  const getListBestSeller = async (startDate: string, endDate: string, setter) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/topOrder/top-ordered-products`, {
        params: { startDate, endDate }
      });
      setter(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };



  const getListBestSellerByWeek = async () => {
    const { startDate, endDate } = getWeekRange();
    await getListBestSeller(startDate, endDate, setListBestSellerByWeek);
  };

  const getListBestSellerByMonth = async () => {
    const { startDate, endDate } = getMonthRange();
    await getListBestSeller(startDate, endDate, setListBestSellerByMonth);
  };

  const getListBestSellerByYear = async () => {
    const { startDate, endDate } = getYearRange();
    await getListBestSeller(startDate, endDate, setListBestSellerByYear);
  };

  const getListBestSellerCustom = async () => {

    const [startDate, endDate] = customDateRange;
    if (startDate && endDate) {
      await getListBestSeller(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), setListBestSellerByCustomDay);
    }

  };


  useEffect(() => {
    if (customDateRange[0] && customDateRange[1]) {
      getListBestSellerCustom();
      getOrdersByCustomDayStatus();
    }
  }, [customDateRange]);

  const dataListBestSeller = {
    1: listBestSellerByDay.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.productDetails.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
    })),
    2: listBestSellerByWeek.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.productDetails.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
    })),
    3: listBestSellerByMonth.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.productDetails.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
    })),
    4: listBestSellerByYear.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.productDetails.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
    })),
    5: listBestSellerByCustomDay.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.productDetails.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
    }))
  };

  const columns = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá", dataIndex: "price", key: "price" },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="product" style={{ height: "70px", width: "70px", objectFit: 'cover' }} />
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
          {text.length > 0 ? text.substring(0, 20) + '...' : text}
        </div>
      )
    },
    { title: "Số lượng bán ra", dataIndex: "totalQuantity", key: "totalQuantity" },
  ];




  const handleChangeButton = async (index: number, type: string) => {
    setIndexButton(index);
    setNameButton(type);
    let data;

    switch (index) {
      case 1:
        data = await getOrdersByDayStatus(new Date().toISOString().split('T')[0]);
        await getOrdersPriceByDayStatus(new Date().toISOString().split('T')[0]);
        await getListBestSellerByDay();
        setDataBieuDo([
          { label: "Đã hoàn thành", value: completedOrdersDay },
          { label: "Đã hủy", value: canceledOrdersDay },
        ]);
        break;
      case 2:
        data = await getOrdersByWeekStatus();
        await getOrdersPriceByWeekStatus();
        await getListBestSellerByWeek();
        setDataBieuDo([
          { label: "Đã hoàn thành", value: completedOrdersWeek },
          { label: "Đã hủy", value: canceledOrdersWeek },
        ]);
        break;
      case 3:
        data = await getOrdersByMonthStatus();
        await getOrdersPriceByMonthStatus();
        await getListBestSellerByMonth();
        setDataBieuDo([
          { label: "Đã hoàn thành", value: completedOrdersMonth },
          { label: "Đã hủy", value: canceledOrdersMonth },
        ])
        break;
      case 4:
        data = await getOrdersByYearStatus();
        await getOrdersPriceByYearStatus();
        await getListBestSellerByYear();
        setDataBieuDo([
          { label: "Đã hoàn thành", value: completedOrdersYear },
          { label: "Đã hủy", value: canceledOrdersYear },
        ])
        break;
      case 5: // Trường hợp chọn khoảng thời gian tùy chỉnh
        if (filter.createAtFrom && filter.createAtTo) {
          data = await getOrdersByCustomStatus(filter.createAtFrom, filter.createAtTo);
          // setDataBieuDo([
          //   { label: "Đã hoàn thành", value : completedOrdersByCustomDay},
          //   { label: "Đã hủy", value: canceledOrdersByCustomDay},
          // ])
        } else {
          // Có thể thông báo cho người dùng rằng cần chọn ngày
          console.warn("Vui lòng chọn khoảng thời gian.");
          return;
        }

        break;
      default:
        return;
    }


  }


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
              format="YYYY-MM-DD"
              onChange={handleCustomDateRangeChange}
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{ borderColor: "#c29957" }}
            />
          )}
        </div>
        <Row gutter={16} style={{ padding: "0 8px" }}>

          <Col span={14}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Danh sách sản phẩm bán chạy theo {nameButton}
            </Title>
            <Table
              dataSource={dataListBestSeller[indexButton]}
              columns={columns}
              pagination={false}

            />

          </Col>
          <Col span={10}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Biểu đồ trạng thái {nameButton}
            </Title>
            <Card style={{ borderColor: "#c29957" }}>
              <PieChartDashBoard data={dataBieuDo} />
            </Card>
          </Col>
          <Col span={24}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Thống kê số đơn theo {['ngày', 'tuần', 'tháng', 'năm', 'tùy chỉnh'][indexButton - 1]}
            </Title>
            <Table
              dataSource={[dataForButton]}
              columns={[
                {
                  title: (
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Tổng đơn hàng
                    </div>
                  ),
                  dataIndex: "total",
                  key: "total",
                  render: text => (
                    <div style={{ textAlign: 'center' }}>
                      {text}
                    </div>
                  )
                },
                {
                  title: (
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Đơn hoàn thành
                    </div>
                  ),
                  dataIndex: "completed",
                  key: "completed",
                  render: text => (
                    <div style={{ textAlign: 'center' }}>
                      {text}
                    </div>
                  )
                },
                {
                  title: (
                    <div style={{ textAlign: 'center', fontWeight: 'bold'}}>
                      Đơn hủy
                    </div>
                  ),
                  dataIndex: "canceled",
                  key: "canceled",
                  render: text => (
                    <div style={{  textAlign: 'center' }}>
                      {text }
                    </div>
                  )
                },
                {
                  title: (
                    <div style={{ textAlign: 'center', fontWeight: 'bold'}}>
                      Tổng thu nhập
                    </div>
                  ),
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                  render: text => (
                    <div style={{ textAlign: 'center' }}>
                     {parseFloat(text).toLocaleString()} VND
                    </div>
                  )
                },
              ]}
              pagination={false}
            />

          </Col>
        </Row>

      </Card>
    </div>
  );
}

