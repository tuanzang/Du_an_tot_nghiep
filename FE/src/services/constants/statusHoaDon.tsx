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
      return "Đang chuẩn bị hàng";
    case "3":
      return "Đang vận chuyển";
    case "4":
      return "Đã giao hàng";
    case "5":
      return "Chờ thanh toán";
    case "6":
      return "Đã thanh toán";
    case "7":
      return "Hoàn thành";
    default:
      return "";
  }
}
