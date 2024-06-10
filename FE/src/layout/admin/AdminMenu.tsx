import React, { useState } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileDoneOutlined,
  UserOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";

export default function AdminMenu({ small }) {
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleClickMenu = (e) => {
    if (small) {
      setOpenKeys([...openKeys, e.key]);
    } else {
      navigate(`/admin/${e.key}`);
    }
  };

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Thống kê</Link>,
    },
    {
      key: "bill",
      icon: <FileDoneOutlined />,
      label: <Link to="/admin/bill">Quản lý đơn hàng</Link>,
    },
    {
      key: "products",
      icon: <BarcodeOutlined />,
      label: "Quản lý sản phẩm",
      children: [
        {
          key: "product",
          label: <Link to="/admin/product">Sản phẩm</Link>,
        },
        {
          key: "category",
          label: <Link to="/admin/category">Danh mục</Link>,
        },
        {
          key: "material",
          label: <Link to="/admin/material">Chất liệu</Link>,
        },
        {
          key: "size",
          label: <Link to="/admin/size">Kích cỡ</Link>,
        },
      ],
    },
    {
      key: "account",
      icon: <UserOutlined />,
      label: "Tài khoản",
      children: [
        {
          key: "staff",
          label: <Link to="/admin/staff">Nhân viên</Link>,
        },
        {
          key: "customer",
          label: <Link to="/admin/customer">Khách hàng</Link>,
        },
      ],
    },
  ];

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={openKeys}
      selectedKeys={[]}
      onClick={handleClickMenu}
      onOpenChange={handleOpenChange}
      items={menuItems}
    />
  );
}
