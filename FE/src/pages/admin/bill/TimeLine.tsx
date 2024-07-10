import { Timeline, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FaRegFileAlt, FaTruck } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { IoCloudDoneSharp } from "react-icons/io5";
import { MdPaid } from "react-icons/md";
import { AiFillCheckCircle, AiOutlineDeliveredProcedure } from "react-icons/ai";
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
        return { color: "gray", icon: <DeleteOutlined /> }; // Đã hủy
      case 1:
        return { color: "#00CC00", icon: <FaRegFileAlt /> }; // Chờ xác nhận
      case 2:
        return { color: "#FFD700", icon: <GiConfirmed /> }; // Chờ giao hàng
      case 3:
        return { color: "#FF5733", icon: <FaTruck /> }; // Đang vận chuyển
      case 4:
        return { color: "#FF9933", icon: <AiOutlineDeliveredProcedure /> }; // Đã giao hàng
      case 5:
        return { color: "#FFC733", icon: <MdPaid /> }; // Chờ thanh toán
      case 6:
        return { color: "#FFAA33", icon: <AiFillCheckCircle /> }; // Đã thanh toán
      case 7:
        return { color: "#00BB00", icon: <IoCloudDoneSharp /> }; // Hoàn thành
      default:
        return { color: "#000000", icon: <FaRegFileAlt /> }; // Mặc định
    }
  };

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <Timeline mode="left">
        {filteredTimeLine.map((item, index) => {
          const { color, icon } = getIconAndColor(
            Number(item.statusBill) ? Number(item.statusBill) : -1
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
