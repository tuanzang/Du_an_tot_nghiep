import { IOption } from "./Option";

export interface IProduct {
  _id: string | number;
  name: string;
  price: number;
  // priceOld: number;
  // size: string[];
  image: string[];
  idSize: string[];
  quantity: number;
  description: string;
  categoryId: string;
  status: number|boolean;
  createdAt: string;
  productSizedata: {
    price: number;
    quantity: number;
    _id: string;
  }[];
  variants: { price: number }[];
  options: IOption[]
}
