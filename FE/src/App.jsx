import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./layout/client/Header";
import Home from "./pages/client/Home";
import Product from "./pages/client/Product";
import Footer from "./layout/client/Footer";

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
      </Routes>
      <Footer />
    </div>
  );
}
