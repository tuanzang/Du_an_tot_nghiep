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
import ForgotPass from "../pages/client/ForgotPass";
import ResetPass from "../pages/client/ResetPass";
import Profile from "../pages/client/profile/Profile";
import ProfileBill from "../pages/client/profile/ProfileBill";
import ProfileChangePass from "../pages/client/profile/ProfileChangePass";

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/bill" element={<ProfileBill />} />
        <Route path="/profile/change-pass" element={<ProfileChangePass />} />
        <Route path="/forgotPass" element={<ForgotPass />} />
        <Route path="/resetPass" element={<ResetPass />} />
      </Routes>
      <Footer />
    </div>
  );
}
