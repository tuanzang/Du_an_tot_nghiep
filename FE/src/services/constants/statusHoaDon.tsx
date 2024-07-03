type Props = {
  status: number;
};

export default function statusHoaDon({ status }: Props) {
  switch (status) {
    
    case 1:
      return "Chờ xác nhận";
    case 2:
      return "Chờ giao hàng";
    case 3:
      return "Đang vận chuyển";
    case 4:
      return "Đã giao hàng";
    case 5:
      return "Đã thanh toán";
    case 6:
      return "Chờ thanh toán";
    case 7:
      return "Hoàn thành";
    case 8:
      return "Đã hủy";
    default:
      console.error("Trạng thái hóa đơn không hợp lệ");
      break;
  }
}
