import { Navigate, Route, Routes } from "react-router-dom";
import Header from "../layout/client/Header";
import Home from "../pages/client/Home";
import Product from "../pages/client/Product";
import Footer from "../layout/client/Footer";
import ClientLogin from "../pages/client/ClientLogin";
import Cart from "../pages/client/Cart";
import Checkout from "../pages/client/Checkout";
import ProductDetail from "../pages/client/ProductDetail";
import VNPayCallback from "../pages/client/VNPayCallback";

export default function ClientRouter() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<ClientLogin />} />
        <Route path="/vnpay-callback" element={<VNPayCallback />} />
      </Routes>
      <Footer />
    </div>
  );
}