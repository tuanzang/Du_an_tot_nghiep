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
import ColumChartDashBoard from "./ColumChartDashBoard";
import { text } from "stream/consumers";
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
  totalRevenue : number;
}

export default function Dashboard() {
  const [dataBieuDo, setDataBieuDo] = useState([]);
  const [dataBieuDo2, setDataBieuDo2] = useState([]);
  const [indexButton, setIndexButton] = useState(1);
  const [nameButton, setNameButton] = useState("ngày");
  const [totalPriceByDay, setTotalPriceByDay] = useState(0);
  const [totalPriceByWeek, setTotalPriceByWeek] = useState(0);
  const [totalPriceByMonth, setTotalPriceByMonth] = useState(0);
  const [totalPriceByYear, setTotalPriceByYear] = useState(0);
  const [totalPriceByCustomDay, setTotalPriceByCustomDay] = useState(0);
  const [priceRefundByDay, setPriceRefundByDay] = useState(0);
  const [priceRefundByWeek, setPriceRefundByWeek] = useState(0);
  const [priceRefundByMonth, setPriceRefundByMonth] = useState(0);
  const [priceRefundByYear, setPriceRefundByYear] = useState(0);
  const [priceRefundByCustomDay, setPriceRefundByCustomDay] = useState(0);
  const [priceCancelByDay, setPriceCancelByDay] = useState(0);
  const [priceCancelByWeek, setPriceCancelByWeek] = useState(0);
  const [priceCancelByMonth, setPriceCancelByMonth] = useState(0);
  const [priceCancelByYear, setPriceCancelByYear] = useState(0);
  const [priceCancelByCustomDay, setPriceCancelByCustomDay] = useState(0);
  const [listBestSellerByDay, setListBestSellerByDay] = useState([]);
  const [listBestSellerByWeek, setListBestSellerByWeek] = useState([]);
  const [listBestSellerByMonth, setListBestSellerByMonth] = useState([]);
  const [listBestSellerByYear, setListBestSellerByYear] = useState([]);
  const [listBestSellerByCustomDay, setListBestSellerByCustomDay] = useState([]);
  const [listStockProductsByDay, setListStockProductsByDay] = useState([]);
  const [listStockProductsByWeek, setListStockProductsByWeek] = useState([]);
  const [listStockProductsByMonth, setListStockProductsByMonth] = useState([]);
  const [listStockProductsByYear, setListStockProductsByYear] = useState([]);
  const [listStockProductsByCustomDay, setListStockProductsByCustomDay] = useState([]);
  const [filter, setFilter] = useState<Filter>({ page: 1, size: 5, createAtFrom: null, createAtTo: null });
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalOrdersThisWeek, setTotalOrdersThisWeek] = useState(0);
  const [totalOrdersThisMonth, setTotalOrdersThisMonth] = useState(0);
  const [totalOrdersThisYear, setTotalOrdersThisYear] = useState(0);
  const [totalOrdersByCustomDay, setTotalOrdersByCustomDay] = useState(0);
  const [completedOrdersByCustomDay, setCompletedOrdersByCustomDay] = useState(0);
  const [canceledOrdersByCustomDay, setCanceledOrdersByCustomDay] = useState(0);
  const [returnedOrdersByCustomDay, setReturnedOrdersByCustomDay] = useState(0);
  const [completedOrdersDay, setCompletedOrdersDay] = useState(0);
  const [canceledOrdersDay, setCanceledOrdersDay] = useState(0);
  const [returnedOrdersDay, setReturnedOrdersDay] = useState(0);
  const [completedOrdersWeek, setCompletedOrdersWeek] = useState(0);
  const [canceledOrdersWeek, setCanceledOrdersWeek] = useState(0);
  const [returnedOrdersWeek, setReturnedOrdersWeek] = useState(0);
  const [completedOrdersMonth, setCompletedOrdersMonth] = useState(0);
  const [canceledOrdersMonth, setCanceledOrdersMonth] = useState(0);
  const [returnedOrdersMonth, setReturnedOrdersMonth] = useState(0);
  const [completedOrdersYear, setCompletedOrdersYear] = useState(0);
  const [canceledOrdersYear, setCanceledOrdersYear] = useState(0);
  const [returnedOrdersYear, setReturnedOrdersYear] = useState(0);

  //tính tổng tiền 
  const getOrdersPriceByDayStatus = async (date = new Date().toISOString().split('T')[0]) => {
    try {
      const resTotalPriceByDay = await axios.get(`http://localhost:3001/api/orders/total-price/day`, {
        params: { 
          dateNow: date,
         }
      });
      const resPriceRefundByDay = await axios.get(`http://localhost:3001/api/orders/price-refund/day`, {
        params: {
          dateNow: date,
        }
      })
      const resPriceCancelByDay = await axios.get(`http://localhost:3001/api/orders/price-cancel/day`, {
        params: {
          dateNow: date,
        }
      })
      
      setTotalPriceByDay(resTotalPriceByDay.data.totalPrice);
      setPriceRefundByDay(resPriceRefundByDay.data.totalPrice);
      setPriceCancelByDay(resPriceCancelByDay.data.totalPrice);
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
          dateEnd: endDate,
        }
      });
      const resPriceRefundByWeek = await axios.get(`http://localhost:3001/api/orders/price-refund/week`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      const resPriceCancelByWeek = await axios.get(`http://localhost:3001/api/orders/price-cancel/week`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      
      setTotalPriceByWeek(resTotalPriceByWeek.data.totalPrice);
      setPriceRefundByWeek(resPriceRefundByWeek.data.totalPrice);
      setPriceCancelByWeek(resPriceCancelByWeek.data.totalPrice);
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
          dateEnd: endDate,
        }
      });
      const resPriceRefundByMonth = await axios.get(`http://localhost:3001/api/orders/price-refund/month`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      const resPriceCancelByMonth = await axios.get(`http://localhost:3001/api/orders/price-cancel/month`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      setTotalPriceByMonth(resTotalPriceByMonth.data.totalPrice);
      setPriceRefundByMonth(resPriceRefundByMonth.data.totalPrice);
      setPriceCancelByMonth(resPriceCancelByMonth.data.totalPrice);
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
          dateEnd: endDate,
        }
      });
      const resPriceRefundByYear = await axios.get(`http://localhost:3001/api/orders/price-refund/year`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      const resPriceCancelByYear = await axios.get(`http://localhost:3001/api/orders/price-cancel/year`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      setTotalPriceByYear(resTotalPriceByYear.data.totalPrice);
      setPriceRefundByYear(resPriceRefundByYear.data.totalPrice);
      setPriceCancelByYear(resPriceCancelByYear.data.totalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersByCustomDayStatus = async () => {
    try {
      const [startDate, endDate] = customDateRange;
      const resTotalPriceByCustomDay = await axios.get(`http://localhost:3001/api/orders/total-price/custom-day`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      });
      const resPriceRefundByCustomDay = await axios.get(`http://localhost:3001/api/orders/price-refund/custom-day`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      const resPriceCancelByCustomDay = await axios.get(`http://localhost:3001/api/orders/price-cancel/custom-day`, {
        params: {
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      setTotalPriceByCustomDay(resTotalPriceByCustomDay.data.totalPrice);
      setPriceRefundByCustomDay(resPriceRefundByCustomDay.data.totalPrice);
      setPriceCancelByCustomDay(resPriceCancelByCustomDay.data.totalPrice);
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
      const resReturned = await axios.post("http://localhost:3001/api/orders", {
        createAtFrom: formattedCreateAtFrom,
        createAtTo: formattedCreateAtTo,
        status: "8",
        ...customDateRange,
      })

      setTotalOrdersByCustomDay(resAllOrdersByCustomDay.data.data.length);
      setCompletedOrdersByCustomDay(resCompleted.data.data.length);
      setCanceledOrdersByCustomDay(resCanceled.data.data.length);
      setReturnedOrdersByCustomDay(resReturned.data.data.length);
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
      const resReturned = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "8",
          dateNow: date,
        }
      })
      setTotalOrdersToday(resAllOrdersByDay.data.data.length);
      setCompletedOrdersDay(resCompleted.data.data.length);
      setCanceledOrdersDay(resCanceled.data.data.length);
      setReturnedOrdersDay(resReturned.data.data.length);
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
      const resReturned = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "8",
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      setTotalOrdersThisWeek(resAllOrdersByWeek.data.data.length);
      setCompletedOrdersWeek(resCompleted.data.data.length);
      setCanceledOrdersWeek(resCanceled.data.data.length);
      setReturnedOrdersWeek(resReturned.data.data.length);
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
      const resReturned = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "8",
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      setTotalOrdersThisMonth(resAllOrdersByMonth.data.data.length);
      setCompletedOrdersMonth(resCompleted.data.data.length);
      setCanceledOrdersMonth(resCanceled.data.data.length);
      setReturnedOrdersMonth(resReturned.data.data.length);
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
      const resReturned = await axios.get(`http://localhost:3001/api/orders`, {
        params: {
          status: "8",
          dateStart: startDate,
          dateEnd: endDate,
        }
      })
      setTotalOrdersThisYear(resAllOrdersByYear.data.data.length);
      setCompletedOrdersYear(resCompleted.data.data.length);
      setCanceledOrdersYear(resCanceled.data.data.length);
      setReturnedOrdersYear(resReturned.data.data.length);
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
      const startDate = dates[0].toISOString().split('T')[0];
    const endDate = dates[1].toISOString().split('T')[0];
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

  // const getDataForButton = () => {
  //   switch (indexButton) {
  //     case 1:
  //       return {
  //         total: totalOrdersToday,
  //         totalPrice: totalPriceByDay,
  //         color: "#e3d7c3",
  //       };
  //     case 2:
  //       return {
  //         total: totalOrdersThisWeek,
  //         totalPrice: totalPriceByWeek,
  //         color: "#e0ccab",
  //       };
  //     case 3:
  //       return {
  //         total: totalOrdersThisMonth,
  //         totalPrice: totalPriceByMonth,
  //         color: "#e0ccab",
  //       };
  //     case 4:
  //       return {
  //         total: totalOrdersThisYear,
  //         totalPrice: totalPriceByYear,
  //         color: "#e3d7c3",
  //       };
  //     case 5:
  //       return {
  //         total: totalOrdersByCustomDay,
  //         totalPrice: totalPriceByCustomDay,
  //         color: "#e0ccab",
  //       }
  //     default:
  //       return {};
  //   }
  // };

  // const dataForButton = getDataForButton();

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

  // Danh sách sản phẩm tồn kho

  const getListStockProductsByDay = async (date = new Date().toISOString().split('T')[0]) => {
    try {
      const allListStockProductsByDay = await axios.get(`http://localhost:3001/api/stockOrder/stock-products`, {
        params: {
          startDate: date
        }
      }
      );
      setListStockProductsByDay(allListStockProductsByDay.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  const getListStockProducts = async (startDate: string, endDate: string, setter) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/stockOrder/stock-products`, {
        params: { startDate, endDate }
      });
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
      await getListStockProducts(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), setListStockProductsByCustomDay);
    }

  };
  useEffect(() => {
    if (customDateRange[0] && customDateRange[1]) {
      getListBestSellerCustom();
      getOrdersByCustomDayStatus();
      getListStockProductsCustom()
    }
  }, [customDateRange]);

  const dataListBestSeller = {
    1: listBestSellerByDay.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue
    })),
    2: listBestSellerByWeek.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue
    })),
    3: listBestSellerByMonth.map((item: BestSellerItem , index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue
    })),
    4: listBestSellerByYear.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue
    })),
    5: listBestSellerByCustomDay.map((item: BestSellerItem, index) => ({
      stt: index + 1,
      name: item.name,
      price: item.price  ,
      image: item.productDetails.image,
      description: item.productDetails.description,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue
    }))
  };
  const dataListStockProducts = {
    1: listStockProductsByDay.map((item: any, index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    })),
    2: listStockProductsByWeek.map((item : any, index) => ({
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
    4: listStockProductsByYear.map((item: any , index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    })),
    5: listStockProductsByCustomDay.map((item: any , index) => ({
      stt: index + 1,
      name: item.name,
      image: item.image,
      description: item.description,
    }))
  };

  const BestSeller = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: '35%' },
    { title: "Giá bán", dataIndex: "price", key: "price", width: '10%',
      render: text => (
        <div style={{ textAlign: 'center' }}>
         {parseFloat(text).toLocaleString()} 
        </div>)
     },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (images: string[]) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {images.slice(0,1).map((image, index) => (
            <img
              key={index}
              style={{ width : "70px",  objectFit: "cover" }}
              src={image}
              alt={`product-image-${index}`}
            />
          ))}
        </div>
      ),
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
    { title: "Số lượng bán ", dataIndex: "totalQuantity", key: "totalQuantity", align: "center"},
    { title: "Tổng tiền thu được ", dataIndex: "totalRevenue", key: "totalRevenue",
      render: text => (
        <div style={{ textAlign: 'center' }}>
         {parseFloat(text).toLocaleString()} 
        </div>
      )
     },
  ];

  const StockOrder = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: '35%' },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (images: string[]) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {images.slice(0,1).map((image, index) => (
            <img
              key={index}
              style={{ width : "70px",  objectFit: "cover" }}
              src={image}
              alt={`product-image-${index}`}
            />
          ))}
        </div>
      ),
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
    }
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
        await getListStockProductsByDay();
        setDataBieuDo([
          { label: "Total", value: totalOrdersToday },
          { label: "Complete", value: completedOrdersDay },
          { label: "Cancel", value: canceledOrdersDay },
          { label: "Return", value: returnedOrdersDay },
        ]);
        setDataBieuDo2([
          { label: "TotalPrice", value: totalPriceByDay },
          { label: "TotalPriceReturn", value: priceRefundByDay },
          { label: "TotalPriceCancel", value: priceCancelByDay },
        ])
        break;
      case 2:
        data = await getOrdersByWeekStatus();
        await getOrdersPriceByWeekStatus();
        await getListBestSellerByWeek();
        await getListStockProductsByWeek();
        setDataBieuDo([
          { label: "Total", value: totalOrdersThisWeek },
          { label: "Complete", value: completedOrdersWeek },
          { label: "Cancel", value: canceledOrdersWeek },
          { label: "Return", value: returnedOrdersWeek },
        ]);
        setDataBieuDo2([
          { label: "TotalPrice", value: totalPriceByWeek },
          { label: "TotalPriceReturn", value: priceRefundByWeek },
          { label: "TotalPriceCancel", value: priceCancelByWeek },
        ])
        break;
      case 3:
        data = await getOrdersByMonthStatus();
        await getOrdersPriceByMonthStatus();
        await getListBestSellerByMonth();
        await getListStockProductsByMonth();
        setDataBieuDo([
          { label: "Total", value: totalOrdersThisMonth },
          { label: "Complete", value: completedOrdersMonth },
          { label: "Cancel", value: canceledOrdersMonth },
          { label: "Return", value: returnedOrdersMonth },
        ]);
        setDataBieuDo2([
          { label: "TotalPrice", value: totalPriceByMonth },
          { label: "TotalPriceReturn", value: priceRefundByMonth },
          { label: "TotalPriceCancel", value: priceCancelByMonth },
        ])
        break;
      case 4:
        data = await getOrdersByYearStatus();
        await getOrdersPriceByYearStatus();
        await getListBestSellerByYear();
        await getListStockProductsByYear();
        setDataBieuDo([
          { label: "Total", value: totalOrdersThisYear },
          { label: "Complete", value: completedOrdersYear },
          { label: "Cancel", value: canceledOrdersYear },
          { label: "Return", value: returnedOrdersYear },
        ]);
        setDataBieuDo2([
          { label: "TotalPrice", value: totalPriceByYear },
          { label: "TotalPriceReturn", value: priceRefundByYear },
          { label: "TotalPriceCancel", value: priceCancelByYear },
        ])
        break;
      case 5: // Trường hợp chọn khoảng thời gian tùy chỉnh
        if (filter.createAtFrom && filter.createAtTo) {
          data = await getOrdersByCustomStatus(filter.createAtFrom, filter.createAtTo);
          setDataBieuDo([
            { label: "Total", value: totalOrdersByCustomDay},
            { label: "Complete", value : completedOrdersByCustomDay},
            { label: "Cancel", value: canceledOrdersByCustomDay},
            { label: "Return", value: returnedOrdersByCustomDay},
          ])
          setDataBieuDo2([
            { label: "TotalPrice", value: totalPriceByCustomDay},
            { label: "TotalPriceReturn", value: priceRefundByCustomDay},
            { label: "TotalPriceCancel", value: priceCancelByCustomDay},
          ])
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

          <Col span={24}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
              Danh sách sản phẩm bán chạy theo {nameButton}
            </Title>
            <Table
              dataSource={dataListBestSeller[indexButton]}
              columns={BestSeller}
              pagination={false}

            />

          </Col>
          <Col span={24}>
            <Title level={4} style={{ fontWeight: "bold", margin: "16px 0", color: "#c29957" }}>
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
            {/* <Table
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
            /> */}
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