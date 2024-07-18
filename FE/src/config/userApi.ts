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
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IUpdateRoleResponse {
  message: string;
  data: IUserResponseData; 
}

interface IBlockUserResponse {
  message: string;
  data: IUserResponseData;
}

interface IUnblockUserResponse {
  message: string;
  data: IUserResponseData;
}


const UserApi = {
  getAllUsers: (): Promise<AxiosResponse<IUserListResponse>> => {
    return axiosInstance.get("/users");
  },

  updateRoleUser: (userId: string, role: string): Promise<AxiosResponse<IUpdateRoleResponse>> => {
    return axiosInstance.patch(`/users/${userId}`, { role });
  },
  
   blockUser: (userId: string): Promise<AxiosResponse<IBlockUserResponse>> => {
    return axiosInstance.patch(`/users/block/${userId}`);
  },
  
    unblockUser: (userId: string): Promise<AxiosResponse<IUnblockUserResponse>> => {
    return axiosInstance.patch(`/users/unlock/${userId}`);
  },
};

export default UserApi;
