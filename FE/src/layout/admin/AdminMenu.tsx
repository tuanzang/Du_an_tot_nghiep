import { useState } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileDoneOutlined,
  UserOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";

type Props = {
  small: boolean;
};

export default function AdminMenu({ small }: Props) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleClickMenu = (e: { key: string }) => {
    if (small) {
      setOpenKeys([...openKeys, e.key]);
    } else {
      navigate(`/admin/${e.key}`);
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
          label: <Link to="/admin/category">Loại</Link>,
        },
      ],
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Tài khoản</Link>
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
