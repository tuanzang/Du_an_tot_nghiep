import React from "react"; // Thêm import React
import { useState } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  AimOutlined,
  CodeSandboxOutlined,
  EditOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

type Props = {
  small: boolean;
};

export default function ProfileMenu({ small }: Props) {
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
      key: "profile",
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Thông tin tài khoản</Link>,
    },
    {
      key: "bill",
      icon: <CodeSandboxOutlined />,
      label: <Link to="/profile/bill">Đơn hàng</Link>,
    },
    {
      key: "password",
      icon: <EditOutlined />,
      label: <Link to="/profile/change-pass">Đổi mật khẩu</Link>,
    },
    {
      key: "address",
      icon: <AimOutlined />,
      label: <Link to="/profile/address">Địa chỉ</Link>,
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
