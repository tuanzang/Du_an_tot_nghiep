import { Children, useState } from "react";
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
  const navigate = useNavigate(); // Sử dụng hook navigate của react-router-dom

  const handleClickMenu = (e: { key: string, label: JSX.Element }) => {
    const { key, label } = e;

    // Tìm kiếm đường link trong label
    const link = label.props.to?.toString(); // Đảm bảo label có props 'to' là một đường dẫn hợp lệ

    if (link) {
      if (small) {
        setOpenKeys((prevKeys) => [...prevKeys, key]);
      } else {
        navigate(`/admin/${key}`); // Điều hướng đến đường dẫn tương ứng
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
      key: "ss",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/bill">Bill</Link>,
    },
    {
      key: "bill",
      icon: <FileDoneOutlined />,
      label: "Quản lý đơn hàng",
      children: [
        {
          key: "all",
          label: <Link to="/admin/order/all">Tất cả</Link>,
        },
        {
          key: "wait-for-confirmation",
          label: <Link to="/admin/order/wait-for-confirmation">Chờ xác nhận</Link>,
        },  
        {
          key: "waiting-for-delivery",
          label: <Link to="/admin/order/waiting-for-delivery">Chờ giao hàng</Link>,
        },
        {
          key: "being-shipped",
          label: <Link to="/admin/order/being-shipped">Đang vận chuyển</Link>,
        },
        {
          key: "delivered",
          label: <Link to="/admin/order/delivered">Đã giao hàng</Link>,
        },
      
        {
          key: "paid",
          label: <Link to="/admin/order/paid">Đã thanh toán</Link>,
        },
        {
          key: "complete",
          label: <Link to="/admin/order/complete">Hoàn thành</Link>,
        }
      ]
      
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
