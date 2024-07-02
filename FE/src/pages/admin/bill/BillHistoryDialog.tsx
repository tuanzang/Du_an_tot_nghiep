import { Modal, Button, Table, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import statusHoaDon from "../../../services/constants/statusHoaDon";

interface OrderTimelineItem {
  id: string;
  createdAt: string;
  role: number;
  fullName: string;
  codeAccount: string;
  statusBill: number | null;
  note: string;
}

interface BillHistoryDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  listOrderTimeLine: OrderTimelineItem[];
}

const BillHistoryDialog = ({
  openDialog,
  setOpenDialog,
  listOrderTimeLine,
}: BillHistoryDialogProps) => {
  const handleClose = () => {
    setOpenDialog(false);
  };

  // Function to generate order history
  const genOrderHistory = (listOrderTimeLine: OrderTimelineItem[]) => {
    if (listOrderTimeLine[0]) {
      let tempStatus = listOrderTimeLine[0].statusBill;
      return listOrderTimeLine.map((his, index) => {
        if (
          (his.statusBill === null || his.statusBill === 10) &&
          listOrderTimeLine[index - 1].statusBill !== null &&
          (his.statusBill === null || his.statusBill === 10) &&
          listOrderTimeLine[index - 1].statusBill !== 10
        ) {
          tempStatus = listOrderTimeLine[index - 1].statusBill;
        }

        // Add a condition to treat statusBill === 10 as null
        if (his.statusBill === null || his.statusBill === 10) {
          return { ...his, statusBill: tempStatus };
        } else {
          return his;
        }
      });
    }
    return [];
  };

  // Columns definition for the Ant Design Table
  const columns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const, // Type assertion to satisfy TypeScript
      render: (text: string) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Người chỉnh sửa",
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
      render: (record: OrderTimelineItem) => (
        <span>
          {record.role === 2 ? "Khách hàng - " : "Nhân viên - "}
          {record.fullName} - {record.codeAccount}
        </span>
      ),
    },
    {
      title: "Trạng thái HĐ",
      dataIndex: "statusBill",
      key: "statusBill",
      align: "center" as const,
      render: (statusBill: number) => (
        <Tag>{statusHoaDon({ status: statusBill })}</Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center" as const,
    },
  ];

  return (
    <Modal
      title="Lịch sử đơn hàng"
      visible={openDialog}
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
