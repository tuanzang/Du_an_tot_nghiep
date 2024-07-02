import { Timeline, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FaRegFileAlt, FaTruck } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { IoCloudDoneSharp } from "react-icons/io5";
import { MdPaid } from "react-icons/md";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import dayjs from "dayjs";
import statusHoaDon from "../../../services/constants/statusHoaDon";

const { Text } = Typography;

interface IOrderTimeline {
  id: string;
  createdAt: string;
  role: number;
  fullName: string;
  codeAccount: string;
  statusBill: number | null;
  note: string;
}

type Props = {
  orderTimeLine: IOrderTimeline[];
};

const TimeLine = ({ orderTimeLine }: Props) => {
  const filteredTimeLine = orderTimeLine.filter(
    (item) => item.statusBill !== null && item.statusBill !== 10
  );

  const getIconAndColor = (statusBill: number) => {
    switch (statusBill) {
      case 1:
      case 8:
        return { color: "#00CC00", icon: <FaRegFileAlt /> };
      case 2:
        return { color: "#FFD700", icon: <GiConfirmed /> };
      case 3:
        return { color: "#FF5733", icon: <FaTruck /> };
      case 4:
        return { color: "#FF9933", icon: <AiOutlineDeliveredProcedure /> };
      case 5:
        return { color: "#FFC733", icon: <MdPaid /> };
      case 6:
        return { color: "#FFAA33", icon: <FaRegFileAlt /> };
      case 7:
        return { color: "#00BB00", icon: <IoCloudDoneSharp /> };
      case 9:
        return { color: "#FF1233", icon: <IoCloudDoneSharp /> };
      case 10:
        return { color: "#FF9933", icon: <IoCloudDoneSharp /> };
      case 11:
        return { color: "#FF9933", icon: <IoCloudDoneSharp /> };
      case 12:
        return { color: "#FF9933", icon: <IoCloudDoneSharp /> };
      case 0:
        return { color: "gray", icon: <DeleteOutlined /> };
      default:
        return { color: "#000000", icon: <FaRegFileAlt /> };
    }
  };

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <Timeline mode="left">
        {filteredTimeLine.map((item, index) => {
          const { color, icon } = getIconAndColor(
            item.statusBill ? item.statusBill : -1
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
                  status: item.statusBill ? item.statusBill : -1,
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
