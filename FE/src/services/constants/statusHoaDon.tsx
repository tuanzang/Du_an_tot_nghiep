type Props = {
  status: string;
};

export default function statusHoaDon({ status }: Props) {
  switch (status) {
    case "0":
      return "Đã hủy";
    case "1":
      return "Chờ xác nhận";
    case "2":
      return "Đã xác nhận";
    case "3":
      return "Đóng gói chờ vận chuyển";
    case "4":
      return "Đang giao hàng";
    case "5":
      return "Đã giao hàng";
    case "6":
      return "Chờ thanh toán";
    case "7":
      return "Đã thanh toán";
    case "8":
      return "Hoàn thành";
    case "9":
      return "Hoàn đơn";
    default:
      return "";
  }
}
