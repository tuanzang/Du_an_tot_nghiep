import numeral from "numeral";

type Props = {
  money: string;
};

export default function formatCurrency({ money }: Props) {
  return numeral(money).format("0,0") + " ₫";
}
