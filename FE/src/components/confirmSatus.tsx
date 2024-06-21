import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

type Props = {
  title: string;
  text: string;
};

export default function confirmStatus({ title, text }: Props) {
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
