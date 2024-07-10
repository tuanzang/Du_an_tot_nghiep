export interface IComment {
  _id: string | null;
  idUser: string;
  idProduct: string;
  fullName: string;
  productName: string;
  avatar: string;
  comment: string;
  createdAt: string;
}
