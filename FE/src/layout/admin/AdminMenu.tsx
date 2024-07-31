import React from "react"; // Thêm import React
import { useState } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileDoneOutlined,
  UserOutlined,
  BarcodeOutlined,
  CommentOutlined,
} from "@ant-design/icons";

type Props = {
  small: boolean;
};

export default function AdminMenu({ small }: Props) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate(); // Sử dụng hook navigate của react-router-dom

  const handleClickMenu = (e: { key: string }) => {
    const key = e.key;

    // Tìm kiếm đường link tương ứng từ menuItems
    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem && React.isValidElement(menuItem.label)) {
      const link = (menuItem.label as React.ReactElement).props.to;
      if (link) {
        if (small) {
          setOpenKeys((prevKeys) => [...prevKeys, key]);
        } else {
          navigate(link.toString()); // Điều hướng đến đường dẫn tương ứng
        }
      }
    }
  };

  const handleOpenChange = (keys: string[]) => {
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
      label: <Link to="/admin/bill">Đơn hàng</Link>,
    },
    // {
    //   key: "bill",
    //   icon: <FileDoneOutlined />,
    //   label: "Quản lý đơn hàng",
    //   children: [
    //     {
    //       key: "all",
    //       label: <Link to="/admin/order/all">Tất cả</Link>,
    //     },
    //     {
    //       key: "wait-for-confirmation",
    //       label: (
    //         <Link to="/admin/order/wait-for-confirmation">Chờ xác nhận</Link>
    //       ),
    //     },
    //     {
    //       key: "waiting-for-delivery",
    //       label: (
    //         <Link to="/admin/order/waiting-for-delivery">Chờ giao hàng</Link>
    //       ),
    //     },
    //     {
    //       key: "being-shipped",
    //       label: <Link to="/admin/order/being-shipped">Đang vận chuyển</Link>,
    //     },
    //     {
    //       key: "delivered",
    //       label: <Link to="/admin/order/delivered">Đã giao hàng</Link>,
    //     },
    //     {
    //       key: "paid",
    //       label: <Link to="/admin/order/paid">Đã thanh toán</Link>,
    //     },
    //     {
    //       key: "complete",
    //       label: <Link to="/admin/order/complete">Hoàn thành</Link>,
    //     },
    //   ],
    // },
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
          key: "size",
          label: <Link to="/admin/size">Size</Link>,
        }
        ,
        {
          key: "voucher",
          label: <Link to="/admin/voucher">Mã giảm giá</Link>,
        }
      ],
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý tài khoản</Link>,
    },
    {
      key: "comments",
      icon: <CommentOutlined />,
      label: <Link to="/admin/comments">Bình luận</Link>,
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
