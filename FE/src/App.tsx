// import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientRouter from "./routers/ClientRouter";
import AdminRouter from "./routers/AdminRouter";
import NotFound404 from "./routers/NotFound404";
import PrivateRouter from "./components/PrivateRouter";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { resetProductSelected } from "./store/cartSlice";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!["/cart", "/checkout"].includes(location.pathname)) {
      dispatch(resetProductSelected());
    }
  }, [location.pathname]);

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
