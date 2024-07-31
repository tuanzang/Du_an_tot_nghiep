export interface IBill {
  _id: string;
  userId: string;
  code: string;
  products: {
    id_: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    size: string;
    variantId: string;
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

export interface IProductBill {
  id_: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  variantId: string;
}
