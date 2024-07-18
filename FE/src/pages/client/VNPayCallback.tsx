import React, { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderApi from "../../config/orderApi";
import { toast } from "react-toastify";

const VNPayCallback = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const txnRef = searchParams.get("vnp_TxnRef");
  const statusCode = searchParams.get("vnp_ResponseCode");

  const updateOrderStatus = useCallback(
    async (orderId: string) => {
      try {
        await OrderApi.updateOrder({ id: orderId, status: "Đã thanh toán" });
        toast.success("Thanh toán thành công");
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (statusCode === "00" && txnRef) {
      const [, orderId] = txnRef.split("_");
      updateOrderStatus(orderId);
    }
  }, [statusCode, txnRef, updateOrderStatus]);

  return <div>Loading...</div>;
};

export default VNPayCallback;
