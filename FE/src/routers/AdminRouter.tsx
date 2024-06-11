import React from "react";
import HeaderAdmin from "../layout/admin/HeaderAdmin";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Bill from "../pages/admin/bill/Bill";
import Product from "../pages/admin/product/Product";
import ProductAdd from "../pages/admin/product/productAdd";
import Size from "../pages/admin/size/Size";
import Category from "../pages/admin/category/Category";
import Material from "../pages/admin/material/Material";
import Staff from "../pages/admin/account/staff/Staff";
import Customer from "../pages/admin/account/customer/Customer";
import ProductEdit from "../pages/admin/product/ProductEdit";
import CategoryAdd from "../pages/admin/category/CategoryAdd";
import CategoryEdit from "../pages/admin/category/CategoryEdit";

export default function AdminRouter() {
  return (
    <HeaderAdmin>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/add" element={<ProductAdd />} />
        <Route path="/product/:id" element={<ProductEdit />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/add" element={<CategoryAdd />} />
        <Route path="/category/:id" element={<CategoryEdit />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/customer" element={<Customer />} />
      </Routes>
    </HeaderAdmin>
  );
}