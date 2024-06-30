import { Navigate, Route, Routes } from "react-router-dom";
import Header from "../layout/client/Header";
import Home from "../pages/client/Home";
import Product from "../pages/client/Product";
import Footer from "../layout/client/Footer";
import ClientLogin from "../pages/client/ClientLogin";
import ProductDetail from "../pages/client/ProductDetail";
import Cart from "../pages/client/Cart";

export default function ClientRouter() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/detail/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<ClientLogin />} />
      </Routes>
      <Footer />
    </div>
  );
}
