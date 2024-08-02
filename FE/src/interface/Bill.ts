export interface IBill {
  _id: string;
  userId: string;
  code: string;
  products: {
    id_: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    variantId: string;
  }[];
  totalPrice: number;
  status: string;
  customerName: string;
  address: string;
  phone: string;
  message: string;
  paymentMethod: string;
  shippingCost: number;
  statusShip: boolean;
  createdAt: string;
}

export interface IProductBill {
  id_: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  variantId: string;
}
