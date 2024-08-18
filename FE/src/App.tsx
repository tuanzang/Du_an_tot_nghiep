// import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ClientRouter from "./routers/ClientRouter";
import AdminRouter from "./routers/AdminRouter";
import NotFound404 from "./routers/NotFound404";
import PrivateRouter from "./components/PrivateRouter";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { resetProductSelected } from "./store/cartSlice";
import { ACCESS_TOKEN_STORAGE_KEY, USER_INFO_STORAGE_KEY } from "./services/constants";
import { IUser } from "./interface/Users";
import { socket } from "./socket";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  useEffect(() => {
    if (!["/cart", "/checkout"].includes(location.pathname)) {
      dispatch(resetProductSelected());
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_INFO_STORAGE_KEY);

    window.location.href = "/login";
  }

  useEffect(() => {
    const onUserBlock = (userId: string) => {
      if (user && user._id === userId) {
        handleLogout()
      }
    };

    socket.on('block user', onUserBlock);

    return () => {
      socket.off('block user', onUserBlock);
    }
  }, [user?._id]);

  return (
    <div>
      <Routes>
        <Route path="/*" element={<ClientRouter />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRouter>
              <AdminRouter />
            </PrivateRouter>
          }
        />
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}
