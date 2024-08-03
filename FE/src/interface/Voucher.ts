export interface IVoucher {
    _id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'amount';
    discountPercentage?: number;
    discountAmount?: number;
    startDate: Date;
    expirationDate: Date;
    quantity: number;
    usedCount?: number;
    status?: 'active' | 'expired' | 'disabled';
    minPurchaseAmount?: number;
  }
  