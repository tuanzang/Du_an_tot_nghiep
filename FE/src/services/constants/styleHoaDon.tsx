type Props = {
  status: string;
};
export default function styleHoaDon({ status }: Props) {
  switch (status) {
    case "0":
      return "chip-da-huy";
    case "1":
      return "chip-cho-xac-nhan";
    case "2":
      return "chip-dang-van-chuyen";
    case "3":
      return "chip-giao-hang";
    case "4":
      return "chip-da-giao-hang";
    case "5":
      return "chip-thanh-toan";
    case "6":
      return "chip-cho-thanh-toan";
    case "7":
      return "chip-da-thanh-toan";
    case "8":
      return "chip-hoan-thanh";
    case "9":
      return "chip-hoan-tien";
    default:
      return "";
  }
}
