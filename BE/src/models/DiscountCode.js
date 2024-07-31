import mongoose from 'mongoose';

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  discountPercentage: { type: Number, min: 0, max: 100 },
  discountAmount: { type: Number, min: 0 },
  startDate: { type: Date, default: Date.now },
  expirationDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  usedCount: { type: Number, default: 0},
  status: { type: String, enum: ['active', 'expired', 'disabled'], default: 'active' },
  minPurchaseAmount: { type: Number, min: 0, default: 0 },

}, { timestamps: true });

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);

export default DiscountCode;

