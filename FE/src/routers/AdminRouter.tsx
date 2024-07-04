import HeaderAdmin from "../layout/admin/HeaderAdmin";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Bill from "../pages/admin/bill/Bill";
import Product from "../pages/admin/product/Product";
import Category from "../pages/admin/category/Category";
import Staff from "../pages/admin/account/staff/Staff";
import ProductEdit from "../pages/admin/product/ProductEdit";
import CategoryAdd from "../pages/admin/category/CategoryAdd";
import CategoryEdit from "../pages/admin/category/CategoryEdit";
import ProductDetailAndEdit from "../pages/admin/product/ProductDetailAndEdit";
import BillDetail from "../pages/admin/bill/BillDetail";
import Size from "../pages/admin/size/Size";
import SizeAdd from "../pages/admin/size/SizeAdd";
import Users from "../pages/admin/users/Users";
import ProductAdd from "../pages/admin/product/productAdd";

// order management
import AllOrder from "../pages/admin/OrderManagement/views/All";
import WaitingForComfirmationOrder from "../pages/admin/OrderManagement/views/WaitForConfirmation";
import WaitingForDeliveryOrder from "../pages/admin/OrderManagement/views/WaitingForDelivery";
import BeingShippedOrder from "../pages/admin/OrderManagement/views/BeingShipped";
import DeliveredOrder from "../pages/admin/OrderManagement/views/Delivered";
import PaidOrder from "../pages/admin/OrderManagement/views/Paid";
import CompleteOrder from "../pages/admin/OrderManagement/views/Complete";


export default function AdminRouter() {
  return (
    <HeaderAdmin>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/bill/detail/:id" element={<BillDetail />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/detail/:id" element={<ProductDetailAndEdit />} />
        <Route path="/product/add" element={<ProductAdd />} />
        <Route path="/product/:id" element={<ProductEdit />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/add" element={<CategoryAdd />} />
        <Route path="/category/:id" element={<CategoryEdit />} />
        <Route path="/size" element={<Size />} />
        <Route path="/size/add" element={<SizeAdd />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/users" element={<Users />} />
        <Route path="/order/all" element={<AllOrder />} />
        <Route path="/order/wait-for-confirmation" element={<WaitingForComfirmationOrder />} />
        <Route path="/order/waiting-for-delivery" element={<WaitingForDeliveryOrder />} />
        <Route path="/order/being-shipped" element={<BeingShippedOrder />} />
        <Route path="/order/delivered" element={<DeliveredOrder />} />
        <Route path="/order/paid" element={<PaidOrder />} />
        <Route path="/order/complete" element={<CompleteOrder />} />
      </Routes>
    </HeaderAdmin>
  );
}
