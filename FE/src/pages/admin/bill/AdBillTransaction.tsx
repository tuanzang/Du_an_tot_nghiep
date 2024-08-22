import { Table } from "antd";
import dayjs from "dayjs";
import formatCurrency from "../../../services/common/formatCurrency";
import { ITransaction } from "../../../interface/Transaction";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

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
          title: "Mã giao dịch",
          dataIndex: "transCode",
          key: "transCode",
          align: "center",
        },
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
          title: "Kiểu thanh toán",
          dataIndex: "type",
          key: "type",
          align: "center",
          render: (text: boolean) => (
            <span>{text === true ? "Tiền mặt" : "Chuyển khoản"}</span>
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
          title: "Ghi chú",
          dataIndex: "note",
          key: "note",
          align: "center",
        },
        {
          title: "Trạng thái",
          dataIndex: "status",
          key: "status",
          align: "center",
          render: (text: boolean) =>
            text ? (
              <CheckCircleOutlined
                style={{ color: "green", fontSize: "20px" }}
              />
            ) : (
              <InfoCircleOutlined style={{ color: "red", fontSize: "20px" }} />
            ),
        },
      ]}
    />
  );
};

export default AdBillTransaction;
