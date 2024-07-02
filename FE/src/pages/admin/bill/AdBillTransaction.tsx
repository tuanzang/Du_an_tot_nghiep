import { Table, Tag } from "antd";
import dayjs from "dayjs";
import formatCurrency from "../../../services/common/formatCurrency";

interface ITransaction {
  id: number;
  totalMoney: number | null;
  createdAt: string;
  type: number;
  paymentMethod: number;
  status: number;
  note: string;
  fullName: string;
}

interface Props {
  listTransaction: ITransaction[];
}

const AdBillTransaction = ({ listTransaction }: Props) => {
  return (
    <Table
      dataSource={listTransaction}
      rowKey="id"
      pagination={false}
      style={{ marginTop: 16 }}
      columns={[
        {
          title: "Số tiền",
          dataIndex: "totalMoney",
          key: "totalMoney",
          align: "center",
          render: (text: number | 0) => (
            <span>{formatCurrency({ money: String(text) })}</span>
          ),
        },
        {
          title: "Thời gian",
          dataIndex: "createdAt",
          key: "createdAt",
          align: "center",
          render: (text: string) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
          title: "Loại giao dịch",
          dataIndex: "type",
          key: "type",
          align: "center",
          render: (text: number) => (
            <Tag color={text ? "green" : "blue"}>
              {text ? "Hoàn tiền" : "Thanh toán"}
            </Tag>
          ),
        },
        {
          title: "PTTT",
          dataIndex: "paymentMethod",
          key: "paymentMethod",
          align: "center",
          render: (text: number) => (
            <Tag color={text === 1 ? "geekblue" : "volcano"}>
              {text === 1 ? "Tiền mặt" : "Chuyển khoản"}
            </Tag>
          ),
        },
        {
          title: "Trạng thái",
          dataIndex: "status",
          key: "status",
          align: "center",
          render: (text: number) => (
            <Tag color={text === 0 ? "success" : "error"}>
              {text === 0 ? "Thành công" : "Không thành công"}
            </Tag>
          ),
        },
        {
          title: "Ghi chú",
          dataIndex: "note",
          key: "note",
          align: "center",
        },
        {
          title: "Nhân viên xác nhận",
          dataIndex: "fullName",
          key: "fullName",
          align: "center",
        },
      ]}
    />
  );
};

export default AdBillTransaction;
