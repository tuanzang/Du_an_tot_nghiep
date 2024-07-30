/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios";

const OrderApi = {
  createOrder: (data: any) => {
    return axiosInstance.post("/orders/add-order", data);
  },
  updateOrder: (data: any) => {
    return axiosInstance.put(`/orders/${data.id}`, data);
  },
  detailOrder: (data: any) => {
    return axiosInstance.get(`/orders/${data.id}`);
  },
};

export default OrderApi;
