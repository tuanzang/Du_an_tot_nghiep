/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { IProduct } from "../interface/Products";
import axiosInstance from "./axios";

interface ICartResponse {
  userId: string;
  products: {
    product: IProduct;
    quantity: number;
    _id: string;
  }[];
  totalPrice: number;
}

interface IAddCartBody {
  productId: string;
  quantity: number;
}

const CartApi = {
  getAllCart: (): Promise<AxiosResponse<ICartResponse>> => {
    return axiosInstance.get("/carts");
  },
  addCart: (data: IAddCartBody) => {
    return axiosInstance.post("/carts", data);
  },
  updateQuantity: (data: any) => {
    return axiosInstance.put("/carts", data);
  },
  deleteProduct: (productId: string) => {
    return axiosInstance.delete(`/carts/${productId}`);
  },
};

export default CartApi;
