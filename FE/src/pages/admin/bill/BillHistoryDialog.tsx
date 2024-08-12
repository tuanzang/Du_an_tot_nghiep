import { Modal, Button, Table, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import { IHistoryBill } from "../../../interface/HistoryBill";
import "./BillStyle.css";
import styleHoaDon from "../../../services/constants/styleHoaDon";

interface BillHistoryDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  listOrderTimeLine: IHistoryBill[];
}

const BillHistoryDialog = ({
  openDialog,
  setOpenDialog,
  listOrderTimeLine,
}: BillHistoryDialogProps) => {
  const handleClose = () => {
    setOpenDialog(false);
  };

  const genOrderHistory = (listOrderTimeLine: IHistoryBill[]) => {
    if (listOrderTimeLine[0]) {
      let tempStatus = listOrderTimeLine[0].statusBill;
      return listOrderTimeLine.map((his, index) => {
        if (
          (his.statusBill === null || Number(his.statusBill) === 10) &&
          listOrderTimeLine[index - 1].statusBill !== null &&
          (his.statusBill === null || Number(his.statusBill) === 10) &&
          Number(listOrderTimeLine[index - 1].statusBill) !== 10
        ) {
          tempStatus = listOrderTimeLine[index - 1].statusBill;
        }

        if (his.statusBill === null || Number(his.statusBill) === 10) {
          return { ...his, statusBill: tempStatus };
        } else {
          return his;
        }
      });
    }
    return [];
  };

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      width: "15%",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Người chỉnh sửa",
      dataIndex: "creator",
      key: "creator",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center" as const,
      width: "15%",
      render: (text: string) => (
        <span>
          {text === "customer"
            ? "Khách hàng"
            : text === "staff"
            ? "Nhân viên"
            : "admin"}
        </span>
      ),
    },
    {
      title: "Trạng thái HĐ",
      dataIndex: "statusBill",
      key: "statusBill",
      align: "center" as const,
      width: "10%",
      render: (statusBill: string) => (
        <Tag className={styleHoaDon({ status: statusBill })}>
          {statusHoaDon({ status: statusBill })}
        </Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "left" as const,
      width: "40%",
    },
  ];

  return (
    <Modal
      title="Lịch sử đơn hàng"
      open={openDialog}
      onCancel={handleClose}
      footer={[
        <Button key="ok" onClick={handleClose}>
          OK
        </Button>,
      ]}
      closeIcon={<CloseOutlined />}
      style={{ top: 20 }}
      width={800} // Adjust width as needed
    >
      <Table
        columns={columns}
        dataSource={genOrderHistory(listOrderTimeLine)}
        pagination={false}
        rowKey="id"
      />
    </Modal>
  );
};

export default BillHistoryDialog;
