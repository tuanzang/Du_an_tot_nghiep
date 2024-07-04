import axiosInstance from "./axios";
import { ISize } from "../interface/Size";

export const getAllSize = async () => {
    try {
        const { data } = await axiosInstance.get(`/sizes`);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const addSize = async (size: ISize) => {
    try {
        const { data } = await axiosInstance.post("/sizes/add", size);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteSize = async (size: ISize) => {
    try {
      const { data } = await axiosInstance.delete(`/sizes/${size._id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  };