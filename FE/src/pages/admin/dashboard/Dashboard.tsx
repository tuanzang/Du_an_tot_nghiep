import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { Card, Col, Row, Typography, Button, DatePicker, Table } from "antd";

import axios from "axios";
import PieChartDashBoard from "./PieChartDashBoard";
import ColumChartDashBoard from "./ColumChartDashBoard";
import { ToastContainer, toast } from "react-toastify";

const { Title } = Typography;
const { RangePicker } = DatePicker;
interface Filter {
  page: number;
  size: number;
  createAtFrom?: string | null;
  createAtTo?: string | null;
}

interface ProductDetails {
  image: string;
  description?: string;
}

interface BestSellerItem {
  stt: number;
  name: string;
  productDetails: ProductDetails;
  categoryName: string;
  totalQuantity: number;
  price: number;
  totalRevenue: number;
}
type ChartData = { label: string; value: number };

export default function Dashboard() {
  const [dataBieuDo, setDataBieuDo] = useState<ChartData[]>([]);
  const [dataBieuDo2, setDataBieuDo2] = useState<ChartData[]>([]);
  const [indexButton, setIndexButton] = useState(1);
  const [nameButton, setNameButton] = useState("ngày");
  const [listBestSellerByDay, setListBestSellerByDay] = useState([]);
  const [listBestSellerByWeek, setListBestSellerByWeek] = useState([]);
  const [listBestSellerByMonth, setListBestSellerByMonth] = useState([]);
  const [listBestSellerByYear, setListBestSellerByYear] = useState([]);
  const [listBestSellerByCustomDay, setListBestSellerByCustomDay] = useState(
    []
  );
  const [listStockProductsByDay, setListStockProductsByDay] = useState([]);
  const [listStockProductsByWeek, setListStockProductsByWeek] = useState([]);
  const [listStockProductsByMonth, setListStockProductsByMonth] = useState([]);
  const [listStockProductsByYear, setListStockProductsByYear] = useState([]);
  const [listStockProductsByCustomDay, setListStockProductsByCustomDay] =
    useState([]);
  const [filter, setFilter] = useState<Filter>({
    page: 1,
    size: 5,
    createAtFrom: null,
    createAtTo: null,
  });
  const [customDateRange, setCustomDateRange] = useState([null, null]);

  //tính tổng tiền
  const getOrdersPriceByDayStatus = async (
    date = new Date().toISOString().split("T")[0]
  ) => {
    try {
      const resTotalPriceByDay = await axios.get(
        `http://localhost:3001/api/orders/total-price/day`,
        {
          params: {
            dateNow: date,
          },
        }
      );
      const resPriceRefundByDay = await axios.get(
        `http://localhost:3001/api/orders/price-refund/day`,
        {
          params: {
            dateNow: date,
          },
        }
      );
      const resPriceCancelByDay = await axios.get(
        `http://localhost:3001/api/orders/price-cancel/day`,
        {
          params: {
            dateNow: date,
          },
        }
      );
      setDataBieuDo2([
        { label: "Lợi nhuận", value: resTotalPriceByDay.data.totalPrice },
        {
          label: "Số tiền đơn hoàn",
          value: resPriceRefundByDay.data.totalPrice,
        },
        {
          label: "Số tiền đơn hủy",
          value: resPriceCancelByDay.data.totalPrice,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersPriceByWeekStatus = async () => {
    try {
      const { startDate, endDate } = getWeekRange();
      const resTotalPriceByWeek = await axios.get(
        `http://localhost:3001/api/orders/total-price/week`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resPriceRefundByWeek = await axios.get(
        `http://localhost:3001/api/orders/price-refund/week`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resPriceCancelByWeek = await axios.get(
        `http://localhost:3001/api/orders/price-cancel/week`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );

      setDataBieuDo2([
        { label: "Lợi nhuận", value: resTotalPriceByWeek.data.totalPrice },
        {
          label: "Số tiền đơn hoàn",
          value: resPriceRefundByWeek.data.totalPrice,
        },
        {
          label: "Số tiền đơn hủy",
          value: resPriceCancelByWeek.data.totalPrice,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersPriceByMonthStatus = async () => {
    try {
      const { startDate, endDate } = getMonthRange();
      const resTotalPriceByMonth = await axios.get(
        `http://localhost:3001/api/orders/total-price/month`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resPriceRefundByMonth = await axios.get(
        `http://localhost:3001/api/orders/price-refund/month`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resPriceCancelByMonth = await axios.get(
        `http://localhost:3001/api/orders/price-cancel/month`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      setDataBieuDo2([
        { label: "Lợi nhuận", value: resTotalPriceByMonth.data.totalPrice },
        {
          label: "Số tiền đơn hoàn",
          value: resPriceRefundByMonth.data.totalPrice,
        },
        {
          label: "Số tiền đơn hủy",
          value: resPriceCancelByMonth.data.totalPrice,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersPriceByYearStatus = async () => {
    try {
      const { startDate, endDate } = getYearRange();
      const resTotalPriceByYear = await axios.get(
        `http://localhost:3001/api/orders/total-price/year`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resPriceRefundByYear = await axios.get(
        `http://localhost:3001/api/orders/price-refund/year`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resPriceCancelByYear = await axios.get(
        `http://localhost:3001/api/orders/price-cancel/year`,
        {
          params: {
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      setDataBieuDo2([
        { label: "Lợi nhuận", value: resTotalPriceByYear.data.totalPrice },
        {
          label: "Số tiền đơn hoàn",
          value: resPriceRefundByYear.data.totalPrice,
        },
        {
          label: "Số tiền đơn hủy",
          value: resPriceCancelByYear.data.totalPrice,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersPriceByCustomDayStatus = async () => {
    try {
      const [dateStart, dateEnd] = customDateRange;
      const resTotalPriceByCustomDay = await axios.get(
        `http://localhost:3001/api/orders/total-price/custom-day`,
        {
          params: {
            dateStart,
            dateEnd,
          },
        }
      );
      const resPriceRefundByCustomDay = await axios.get(
        `http://localhost:3001/api/orders/price-refund/custom-day`,
        {
          params: {
            dateStart,
            dateEnd,
          },
        }
      );
      const resPriceCancelByCustomDay = await axios.get(
        `http://localhost:3001/api/orders/price-cancel/custom-day`,
        {
          params: {
            dateStart,
            dateEnd,
          },
        }
      );
      setDataBieuDo2([
        { label: "Lợi nhuận", value: resTotalPriceByCustomDay.data.totalPrice },
        {
          label: "Số tiền đơn hoàn",
          value: resPriceRefundByCustomDay.data.totalPrice,
        },
        {
          label: "Số tiền đơn hủy",
          value: resPriceCancelByCustomDay.data.totalPrice,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  // tính số đơn hàng
  const getOrdersByCustomStatus = async () => {
    try {
      const [dateStart, dateEnd] = customDateRange;

      const resCanceled = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "0",
        },
      });
      const resWaitConfirmed = await axios.get(
        "http://localhost:3001/api/orders",
        {
          params: {
            dateStart,
            dateEnd,
            status: "1",
          },
        }
      );
      const resConfirmed = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "2",
        },
      });
      const resPacking = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "3",
        },
      });
      const resShipping = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "4",
        },
      });
      const resDelivered = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "5",
        },
      });
      const resPaid = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "6",
        },
      });
      const resCompleted = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "7",
        },
      });
      const resReturned = await axios.get("http://localhost:3001/api/orders", {
        params: {
          dateStart,
          dateEnd,
          status: "8",
        },
      });
      console.log(dateStart, dateEnd);

      setDataBieuDo([
        { label: "Thành công", value: resCompleted.data.totalOrders },
        { label: "Đã hủy", value: resCanceled.data.totalOrders },
        { label: "Hoàn trả", value: resReturned.data.totalOrders },
        { label: "Chờ xác nhận", value: resWaitConfirmed.data.totalOrders },
        { label: "Đã xác nhận", value: resConfirmed.data.totalOrders },
        { label: "Đang đóng gói", value: resPacking.data.totalOrders },
        { label: "Đang giao đơn", value: resShipping.data.totalOrders },
        { label: "Đã giao đơn", value: resDelivered.data.totalOrders },
        { label: "Đã thanh toán", value: resPaid.data.totalOrders },
      ]);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
  const getOrdersByDayStatus = async (
    date = new Date().toISOString().split("T")[0]
  ) => {
    try {
      const resCanceledByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "0",
            dateNow: date,
          },
        }
      );
      const resWaitConfirmedByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "1",
            dateNow: date,
          },
        }
      );
      const resConfirmedByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "2",
            dateNow: date,
          },
        }
      );
      const resPackingByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "3",
            dateNow: date,
          },
        }
      );
      const resShippingByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "4",
            dateNow: date,
          },
        }
      );
      const resDeliveredByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "5",
            dateNow: date,
          },
        }
      );
      const resPaidByDay = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "6",
          dateNow: date,
        },
      });
      const resCompletedByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "7",
            dateNow: date,
          },
        }
      );
      const resReturnedByDay = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "8",
            dateNow: date,
          },
        }
      );

      setDataBieuDo([
        { label: "Thành công", value: resCompletedByDay.data.totalOrders },
        { label: "Đã hủy", value: resCanceledByDay.data.totalOrders },
        { label: "Hoàn trả", value: resReturnedByDay.data.totalOrders },
        {
          label: "Chờ xác nhận",
          value: resWaitConfirmedByDay.data.totalOrders,
        },
        { label: "Đã xác nhận", value: resConfirmedByDay.data.totalOrders },
        { label: "Đang đóng gói", value: resPackingByDay.data.totalOrders },
        { label: "Đang giao đơn", value: resShippingByDay.data.totalOrders },
        { label: "Đã giao đơn", value: resDeliveredByDay.data.totalOrders },
        { label: "Đã thanh toán", value: resPaidByDay.data.totalOrders },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersByWeekStatus = async () => {
    try {
      const { startDate, endDate } = getWeekRange();
      const resCanceled = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "0",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resWaitConfirmed = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "1",
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resConfirmed = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "2",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resPacking = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "3",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resShipping = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "4",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resDelivered = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "5",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resPaid = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "6",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resCompleted = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "7",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resReturned = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "8",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });

      setDataBieuDo([
        { label: "Thành công", value: resCompleted.data.totalOrders },
        { label: "Đã hủy", value: resCanceled.data.totalOrders },
        { label: "Hoàn trả", value: resReturned.data.totalOrders },
        { label: "Chờ xác nhận", value: resWaitConfirmed.data.totalOrders },
        { label: "Đã xác nhận", value: resConfirmed.data.totalOrders },
        { label: "Đang đóng gói", value: resPacking.data.totalOrders },
        { label: "Đang giao đơn", value: resShipping.data.totalOrders },
        { label: "Đã giao đơn", value: resDelivered.data.totalOrders },
        { label: "Đã thanh toán", value: resPaid.data.totalOrders },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getWeekRange = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    );
    const endOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)
    );

    return {
      startDate: startOfWeek.toISOString().split("T")[0],
      endDate: endOfWeek.toISOString().split("T")[0],
    };
  };

  const getOrdersByMonthStatus = async () => {
    try {
      const { startDate, endDate } = getMonthRange();
      const resCanceled = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "0",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resWaitConfirmed = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "1",
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resConfirmed = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "2",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resPacking = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "3",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resShipping = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "4",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resDelivered = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "5",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resPaid = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "6",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resCompleted = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "7",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resReturned = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "8",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      setDataBieuDo([
        { label: "Thành công", value: resCompleted.data.totalOrders },
        { label: "Đã hủy", value: resCanceled.data.totalOrders },
        { label: "Hoàn trả", value: resReturned.data.totalOrders },
        { label: "Chờ xác nhận", value: resWaitConfirmed.data.totalOrders },
        { label: "Đã xác nhận", value: resConfirmed.data.totalOrders },
        { label: "Đang đóng gói", value: resPacking.data.totalOrders },
        { label: "Đang giao đơn", value: resShipping.data.totalOrders },
        { label: "Đã giao đơn", value: resDelivered.data.totalOrders },
        { label: "Đã thanh toán", value: resPaid.data.totalOrders },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getMonthRange = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    return {
      startDate: startOfMonth.toISOString().split("T")[0],
      endDate: endOfMonth.toISOString().split("T")[0],
    };
  };

  const getOrdersByYearStatus = async () => {
    try {
      const { startDate, endDate } = getYearRange();
      const resCanceled = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "0",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resWaitConfirmed = await axios.get(
        `http://localhost:3001/api/orders`,
        {
          params: {
            status: "1",
            dateStart: startDate,
            dateEnd: endDate,
          },
        }
      );
      const resConfirmed = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "2",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resPacking = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "3",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resShipping = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "4",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resDelivered = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "5",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resPaid = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "6",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resCompleted = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "7",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      const resReturned = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "8",
          dateStart: startDate,
          dateEnd: endDate,
        },
      });
      setDataBieuDo([
        { label: "Thành công", value: resCompleted.data.totalOrders },
        { label: "Đã hủy", value: resCanceled.data.totalOrders },
        { label: "Hoàn trả", value: resReturned.data.totalOrders },
        { label: "Chờ xác nhận", value: resWaitConfirmed.data.totalOrders },
        { label: "Đã xác nhận", value: resConfirmed.data.totalOrders },
        { label: "Đang đóng gói", value: resPacking.data.totalOrders },
        { label: "Đang giao đơn", value: resShipping.data.totalOrders },
        { label: "Đã giao đơn", value: resDelivered.data.totalOrders },
        { label: "Đã thanh toán", value: resPaid.data.totalOrders },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getYearRange = () => {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

    return {
      startDate: startOfYear.toISOString().split("T")[0],
      endDate: endOfYear.toISOString().split("T")[0],
    };
  };
  const handleCustomDateRangeChange = (dates) => {
    setCustomDateRange(dates);
    if (dates && dates.length === 2) {
      setCustomDateRange(dates);
    }
    getOrdersByCustomStatus();
    getOrdersPriceByCustomDayStatus();
  };

  useEffect(() => {
    handleChangeButton(1, nameButton);
  }, []);

  // Sản phẩm được bán chạy nhất
  const getListBestSellerByDay = async (
    date = new Date().toISOString().split("T")[0]
  ) => {
    try {
      const allListBestSellerByDay = await axios.get(
        `http://localhost:3001/api/topOrder/top-ordered-products`,
        {
          params: {
            startDate: date,
          },
        }
      );
      setListBestSellerByDay(allListBestSellerByDay.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getListBestSeller = async (
    startDate: string,
    endDate: string,
    setter
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/topOrder/top-ordered-products`,
        {
          params: { startDate, endDate },
        }
      );
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
      await getListBestSeller(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        setListBestSellerByCustomDay
      );
    }
  };

  // Danh sách sản phẩm tồn kho

  const getListStockProductsByDay = async (
    date = new Date().toISOString().split("T")[0]
  ) => {
    try {
      const allListStockProductsByDay = await axios.get(
        `http://localhost:3001/api/stockOrder/stock-products`,
        {
          params: {
            startDate: date,
          },
        }
      );
      setListStockProductsByDay(allListStockProductsByDay.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getListStockProducts = async (
    startDate: string,
    endDate: string,
    setter
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/stockOrder/stock-products`,
        {
          params: { startDate, endDate },
        }
      );
      setter(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getListStockProductsByWeek = async () => {
    const { startDate, endDate } = getWeekRange();
    await getListStockProducts(startDate, endDate, setListStockProductsByWeek);
  };

  const getListStockProductsByMonth = async () => {
    const { startDate, endDate } = getMonthRange();
    await getListStockProducts(startDate, endDate, setListStockProductsByMonth);
  };

  const getListStockProductsByYear = async () => {
    const { startDate, endDate } = getYearRange();
    await getListStockProducts(startDate, endDate, setListStockProductsByYear);
  };

  const getListStockProductsCustom = async () => {
    const [startDate, endDate] = customDateRange;
    if (startDate && endDate) {
      await getListStockProducts(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        setListStockProductsByCustomDay
      );
    }
  };
  useEffect(() => {
    getListBestSellerCustom();
    getListStockProductsCustom();
    getOrdersPriceByCustomDayStatus();
    getOrdersByCustomStatus();
  }, [customDateRange]);

  const dataListBestSeller = {
    1: listBestSellerByDay.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue,
    })),
    2: listBestSellerByWeek.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue,
    })),
    3: listBestSellerByMonth.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue,
    })),
    4: listBestSellerByYear.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue,
    })),
    5: listBestSellerByCustomDay.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue,
    })),
  };
  const dataListStockProducts = {
    1: listStockProductsByDay.map((item: any, index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    })),
    2: listStockProductsByWeek.map((item: any, index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    })),
    3: listStockProductsByMonth.map((item: any, index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    })),
    4: listStockProductsByYear.map((item: any, index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    })),
    5: listStockProductsByCustomDay.map((item: any, index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    })),
  };

  const BestSeller = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: "35%" },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {parseFloat(text).toLocaleString()}
        </div>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (images: string[]) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {images.slice(0, 1).map((image, index) => (
            <img
              key={index}
              style={{ width: "70px", objectFit: "cover" }}
              src={image}
              alt={`product-image-${index}`}
            />
          ))}
        </div>
      ),
    },

    {
      title: "Số lượng bán ",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center",
    },
    {
      title: "Doanh thu dự kiến ",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {parseFloat(text).toLocaleString()}
        </div>
      ),
    },
  ];

  const StockOrder = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: "35%" },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (images: string[]) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {images.slice(0, 1).map((image, index) => (
            <img
              key={index}
              style={{ width: "70px", objectFit: "cover" }}
              src={image}
              alt={`product-image-${index}`}
            />
          ))}
        </div>
      ),
    },
  ];

  const handleChangeButton = async (index: number, type: string) => {
    setIndexButton(index);
    setNameButton(type);

    const resetData = () => {
      setListBestSellerByCustomDay([]);
      setListStockProductsByCustomDay([]);
      setDataBieuDo([]);
      setDataBieuDo2([]);
    };
    switch (index) {
      case 1:
        await Promise.all([
          getOrdersByDayStatus(),
          getOrdersPriceByDayStatus(),
          getListBestSellerByDay(),
          getListStockProductsByDay(),
        ]);
        break;
      case 2:
        await Promise.all([
          getOrdersByWeekStatus(),
          getOrdersPriceByWeekStatus(),
          getListBestSellerByWeek(),
          getListStockProductsByWeek(),
        ]);
        break;
      case 3:
        await Promise.all([
          getOrdersByMonthStatus(),
          getOrdersPriceByMonthStatus(),
          getListBestSellerByMonth(),
          getListStockProductsByMonth(),
        ]);

        break;
      case 4:
        await Promise.all([
          getOrdersByYearStatus(),
          getOrdersPriceByYearStatus(),
          getListBestSellerByYear(),
          getListStockProductsByYear(),
        ]);
        break;
      case 5:
        if (filter.createAtFrom && filter.createAtTo) {
          await Promise.all([
            getOrdersByCustomStatus(),
            getOrdersPriceByCustomDayStatus(),
            getListBestSellerCustom(),
            getListStockProductsCustom(),
          ]);
        } else {
          resetData();
          toast.info("Vui lòng chọn ngày bắt đầu và ngày kết thúc", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      default:
        return;
    }
  };

  return (
    <div>
      {/* tên màn hình */}
      <BreadcrumbsCustom listLink={[]} nameHere={"Thống kê"} />

      {/* bộ lọc */}
      <Card bordered={false}>
        <Title level={4} style={{ fontWeight: "bold", color: "#c29957" }}>
          Bộ lọc
        </Title>
        <div style={{ padding: "0 8px" }}>
          {["ngày", "tuần", "tháng", "năm", "tùy chỉnh"].map((type, index) => (
            <Button
              key={type}
              style={{
                backgroundColor:
                  indexButton === index + 1 ? "#c29957" : "white",
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
          <ToastContainer />
        </div>
        <Row gutter={16} style={{ padding: "0 8px" }}>

          <Col span={24}>
            <Title
              level={4}
              style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}
            >
              Danh sách sản phẩm bán chạy theo {nameButton}
            </Title>
            <Table
              dataSource={dataListBestSeller[indexButton]}
              columns={BestSeller}
              pagination={false}
            />
          </Col>
          <Col span={24}>
            <Title
              level={4}
              style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}
            >
              Danh sách sản phẩm tồn kho theo {nameButton}
            </Title>
            <Table
              dataSource={dataListStockProducts[indexButton]}
              columns={StockOrder}
              pagination={false}
            />
          </Col>

          <Col span={12}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Thống kê Doanh Thu theo {nameButton}
            </Title>
            <Card style={{ borderColor: "#c29957" }}>
              <ColumChartDashBoard data={dataBieuDo2} />
            </Card>
          </Col>
          <Col span={12}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Biểu đồ trạng thái, số lượng đơn theo {nameButton}
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
