import { Timeline, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FaBoxOpen, FaRegFileAlt, FaTruck } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { MdCheckCircle } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import dayjs from "dayjs";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import { IHistoryBill } from "../../../interface/HistoryBill";

const { Text } = Typography;

type Props = {
  orderTimeLine: IHistoryBill[];
};

const TimeLine = ({ orderTimeLine }: Props) => {
  const filteredTimeLine = orderTimeLine.filter(
    (item) =>
      Number(item.statusBill) !== null && Number(Number(item.statusBill)) !== 10
  );

  const getIconAndColor = (statusBill: number) => {
    switch (statusBill) {
      case 0:
        return { color: "red", icon: <DeleteOutlined /> }; // Đã hủy
      case 1:
        return { color: "gold", icon: <FaRegFileAlt /> }; // Chờ xác nhận
      case 2:
        return { color: "orange", icon: <GiConfirmed /> }; // đã xác nhận
      case 3:
        return { color: "#ff4500", icon: <FaBoxOpen /> }; // đóng gói và vận chuyển
      case 4:
        return { color: "blue", icon: <FaTruck /> }; // đang giao hàng
      case 5:
        return { color: "#ff00ff", icon: <MdCheckCircle /> }; // đã giao hàng
      case 6:
        return { color: "rgb(23, 150, 23)", icon: <AiFillCheckCircle /> }; // hoàn thành
      case 7:
        return { color: "gray", icon: <IoReturnDownBackSharp /> }; // hoàn đơn
      default:
        return { color: "magenta", icon: <FaRegFileAlt /> }; // Mặc định
    }
  };

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <Timeline mode="left">
        {filteredTimeLine.map((item, index) => {
          const { color, icon } = getIconAndColor(
            item.statusBill ? Number(item.statusBill) : -1
          );
          return (
            <Timeline.Item
              key={index}
              dot={icon}
              color={color}
              style={{
                display: "inline-block",
                verticalAlign: "top",
                marginRight: 16,
              }}
            >
              <h5 style={{ margin: "8px 0" }}>
                {statusHoaDon({
                  status: item.statusBill,
                })}
              </h5>
              <Text type="secondary">
                {dayjs(item.createdAt).format("DD-MM-YYYY HH:mm:ss")}
              </Text>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </div>
  );
};

export default TimeLine;
