import React from "react";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_INFO_STORAGE_KEY,
} from "../services/constants";
import { Navigate } from "react-router-dom";

interface IPrivateRouterProps {
  children: JSX.Element;
}

const PrivateRouter = ({ children }: IPrivateRouterProps) => {
  const isLogged = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const userInfo =
    JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY) as string) || "";

  return isLogged && userInfo?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRouter;
