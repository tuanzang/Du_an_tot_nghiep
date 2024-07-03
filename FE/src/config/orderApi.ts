/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios";

const OrderApi = {
  createOrder: (data: any) => {
    return axiosInstance.post("/orders/add-order", data);
  },
};

export default OrderApi;
