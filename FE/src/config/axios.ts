import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY } from "../services/constants";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
});

axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (accessToken) {
      config.headers.Authorization = `${accessToken}`;
    }
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
