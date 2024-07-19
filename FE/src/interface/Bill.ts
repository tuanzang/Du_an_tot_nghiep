export interface IBill {
  _id: string;
  userId: string;
  code: string;
  products: {
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  status: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  message: string;
  paymentMethod: string;
  createdAt: string;
}
