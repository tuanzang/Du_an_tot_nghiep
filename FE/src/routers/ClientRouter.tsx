import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "../layout/client/Header";
import Home from "../pages/client/Home";
import Product from "../pages/client/Product";
import Footer from "../layout/client/Footer";
import ClientLogin from "../pages/client/ClientLogin";
import Payment from "../pages/client/Payment";
import CartPage from "../pages/client/Cart";
import ProductDetail from "../pages/client/ProductDetail";

export default function ClientRouter() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <Footer />
    </div>
  );
}
