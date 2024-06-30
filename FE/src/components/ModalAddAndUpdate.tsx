import { ReactNode } from "react";
import { Button, Modal, Typography, Space } from "antd";

type ModalAddAndUpdateProps = {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  buttonSubmit: ReactNode;
  width?: number;
  closeButton?: boolean;
};

export default function ModalAddAndUpdate({
  children,
  open,
  setOpen,
  title,
  buttonSubmit,
  width,
  closeButton,
}: ModalAddAndUpdateProps) {
  return (
    <Modal
      width={width || 520} // 'xs' in Material-UI is approximately 520px in width
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
    >
      <Typography.Title
        level={5}
        style={{
          textAlign: "center",
          fontWeight: 600,
          color: "gray",
          marginBottom: "16px",
        }}
      >
        <span style={{ color: "#c29957" }}>{title}</span>
      </Typography.Title>
      {children}
      {!closeButton && (
        <Space
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button onClick={() => setOpen(false)} type="primary" danger>
            Đóng
          </Button>
          {buttonSubmit}
        </Space>
      )}
    </Modal>
  );
}
