import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderApi from "../../config/orderApi";
import { toast } from "react-toastify";
import axios from "axios";
import { IUser } from "../../interface/Users";
import { USER_INFO_STORAGE_KEY } from "../../services/constants";
import { IHistoryBill } from "../../interface/HistoryBill";
import { ITransaction } from "../../interface/Transaction";
import { IBill } from "../../interface/Bill";

const VNPayCallback = () => {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const txnRef = searchParams.get("vnp_TxnRef");
  const statusCode = searchParams.get("vnp_ResponseCode");

  const updateOrderStatus = useCallback(
    async (transCode: string, orderId: string) => {
      try {
        const res = await OrderApi.updateOrder({
          id: orderId,
          status: "Đã thanh toán",
        });
        createNewHistory(res.data.data._id, "1", user);
        handleConfirmPayment(res.data.data, user, transCode);
        toast.success("Thanh toán thành công");
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    },
    [navigate, user]
  );

  const createNewHistory = async (
    idBill: string | null,
    statusBill: string | null,
    user: IUser | null
  ) => {
    if (idBill === null || statusBill === null || user === null) {
      toast.warning("Không thể tạo lịch sử đơn hàng!");
      return;
    }
    const dataHistoryBill: IHistoryBill = {
      _id: null,
      idUser: user._id,
      idBill: idBill,
      creator: user.name,
      role: user.role,
      statusBill: statusBill,
      note: "",
      createdAt: null,
    };

    try {
      // Gửi yêu cầu tạo lịch sử
      await axios.post(
        "http://localhost:3001/api//history-bill/add",
        dataHistoryBill
      );
    } catch (error) {
      toast.error("Tạo lịch sử thất bại");
    }
  };

  // xác nhận thanh toán hóa đơn
  const handleConfirmPayment = async (
    bill: IBill | null,
    user: IUser | null,
    transCode: string | null
  ) => {
    if (!bill || !user || transCode === null) {
      toast.error("Không thể thanh toán");
      return;
    }
    if (transCode === "") {
      toast.error("Không thể thanh toán");
      return;
    }

    const confirmPaymentRequest: ITransaction = {
      _id: null,
      idUser: user._id,
      idBill: bill._id,
      transCode: transCode,
      totalMoney: bill.totalPrice,
      note: "",
      status: true,
      createdAt: "",
    };

    // xác nhận thanh toán
    try {
      await axios.post(
        "http://localhost:3001/api/trans/add",
        confirmPaymentRequest
      );
    } catch (error) {
      toast.error("Thanh toán thất bại");
    }
  };

  useEffect(() => {
    if (statusCode === "00" && txnRef) {
      const [transCode, orderId] = txnRef.split("_");
      updateOrderStatus(transCode, orderId);
    }
  }, [statusCode, txnRef, updateOrderStatus]);

  return <div>Loading...</div>;
};

export default VNPayCallback;
