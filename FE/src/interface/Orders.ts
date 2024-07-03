export interface IOrder {
    _id: number;
    userId: string;
    products: string[];
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