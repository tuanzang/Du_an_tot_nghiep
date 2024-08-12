export interface ICategory {
  _id: string;
  loai: string;
  status: string;
  products: string[];
  options: { image: File | string }[];
}
