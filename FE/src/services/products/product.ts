import axiosInstance from "../../config/axios";
import { IProduct } from "../../interface/Products";

export const getAllProducts = async () => {
  try {
    const { data } = await axiosInstance.get(`/products`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOneProduct = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addProduct = async (product: IProduct) => {
  try {
    const { data } = await axiosInstance.post("/products/add", product);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (product: IProduct) => {
  try {
    const { data } = await axiosInstance.delete(`/products/${product._id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (product: IProduct) => {
  try {
    const { data } = await axiosInstance.put(
      `/products/${product._id}`,
      product
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
