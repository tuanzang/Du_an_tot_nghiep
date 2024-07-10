export interface ITransaction {
  _id: string | null;
  idUser: string;
  idBill: string;
  transCode: string;
  totalMoney: number;
  note: string;
  status: boolean;
  createdAt: string;
}
