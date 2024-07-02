// import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientRouter from "./routers/ClientRouter";
import AdminRouter from "./routers/AdminRouter";
import NotFound404 from "./routers/NotFound404";
<<<<<<< HEAD
=======

import PrivateRouter from "./components/PrivateRouter";
>>>>>>> 1d77e75b122fbe7c8fc4f114b72264039c009b79

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<ClientRouter />} />
<<<<<<< HEAD
        <Route path="/admin/*" element={<AdminRouter />} />
=======
        <Route
          path="/admin/*"
          element={
            <PrivateRouter>
              <AdminRouter />
            </PrivateRouter>
          }
        />
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
>>>>>>> 1d77e75b122fbe7c8fc4f114b72264039c009b79
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </div>
  );
}
