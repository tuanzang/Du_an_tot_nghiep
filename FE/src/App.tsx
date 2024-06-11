import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientRouter from "./routers/ClientRouter";
import AdminRouter from "./routers/AdminRouter";
import NotFound404 from "./routers/NotFound404";
import AdminLogin from "./pages/admin/login/AdminLogin";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<ClientRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </div>
  );
}