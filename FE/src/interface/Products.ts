export interface IProduct {
  _id: number;
  name: string;
  price: number;
  sizeId: string[];
  image: string[];
  description: string;
  quantity: number;
  categoryId: string;
  status: boolean;
}
 