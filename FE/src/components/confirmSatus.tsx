import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import React from "react";

export default function confirmStatus(title: string, text: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: title,
      content: text,
      icon: <ExclamationCircleOutlined />,
      okText: "Vâng!",
      okButtonProps: {
        style: { backgroundColor: "#F2721E", borderColor: "#F2721E" },
      },
      cancelText: "Hủy",
      cancelButtonProps: {
        style: { backgroundColor: "#FF3333", borderColor: "#FF3333" },
      },
      onOk() {
        resolve(true);
      },
      onCancel() {
        reject(false);
      },
    });
  });
}
