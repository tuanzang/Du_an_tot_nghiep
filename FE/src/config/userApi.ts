import { AxiosResponse } from "axios";
import axiosInstance from "./axios";

interface IUserListResponse {
  message: string;
  data: IUserResponseData[];
}

export interface IUserResponseData {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

const UserApi = {
  getAllUsers: (): Promise<AxiosResponse<IUserListResponse>> => {
    return axiosInstance.get("/users");
  },
};

export default UserApi;
