import { ReactNode } from "react";
import { Modal, Button, Typography, Space } from "antd";

interface DialogAddUpdateProps {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  buttonSubmit?: ReactNode;
  width?: "xs" | "sm" | "md" | "lg" | "xl";
  closeButton?: boolean;
}

const DialogAddUpdate = ({
  children,
  open,
  setOpen,
  title,
  buttonSubmit,
  width,
  closeButton,
}: DialogAddUpdateProps) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title={
        <Typography.Text
          strong
          style={{ color: "gray", textAlign: "center", display: "block" }}
        >
          {title}
        </Typography.Text>
      }
      onCancel={handleCancel}
      footer={null}
      width={
        width === "xs"
          ? 100
          : width === "sm"
          ? 200
          : width === "md"
          ? 400
          : width === "lg"
          ? 400
          : 600
      }
    >
      {children}
      {!closeButton && (
        <Space
          style={{ marginTop: 16, display: "flex", justifyContent: "center" }}
        >
          <Button onClick={handleCancel} danger>
            Đóng
          </Button>
          {buttonSubmit}
        </Space>
      )}
    </Modal>
  );
};

export default DialogAddUpdate;
