// import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientRouter from "./routers/ClientRouter";
import AdminRouter from "./routers/AdminRouter";
import NotFound404 from "./routers/NotFound404";
import PrivateRouter from "./components/PrivateRouter";
import { ToastContainer } from "react-toastify";
import "./App.css";

export default function App() {
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
