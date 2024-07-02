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
import Users from "../pages/admin/users/Users";
import ProductAdd from "../pages/admin/product/ProductAdd";

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
        <Route path="/staff" element={<Staff />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </HeaderAdmin>
  );
}
