import DiscountCode from '../models/DiscountCode.js';

import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

const discountSchema = Joi.object({
  code: Joi.string().required().messages({
    "any.required": "Mã giảm giá là bắt buộc",
  }),
  description: Joi.string().allow(''),
  discountType: Joi.string().valid('percentage', 'amount').required().messages({
    "any.required": "Loại giảm giá là bắt buộc",
    "any.only": "Loại giảm giá phải là 'percentage' hoặc 'amount'",
  }),
  discountPercentage: Joi.number().min(0).max(100).when('discountType', {
    is: 'percentage',
    then: Joi.required().messages({
      "any.required": "Phần trăm giảm giá là bắt buộc khi loại giảm giá là 'percentage'",
      "number.min": "Phần trăm giảm giá phải lớn hơn hoặc bằng 0",
      "number.max": "Phần trăm giảm giá phải nhỏ hơn hoặc bằng 100",
    }),
  }),
  discountAmount: Joi.number().min(0).when('discountType', {
    is: 'amount',
    then: Joi.required().messages({
      "any.required": "Số tiền giảm giá là bắt buộc khi loại giảm giá là 'amount'",
      "number.min": "Số tiền giảm giá phải lớn hơn hoặc bằng 0",
    }),
  }),
  startDate: Joi.date().required().messages({
    "any.required": "Ngày bắt đầu là bắt buộc",
  }),
  expirationDate: Joi.date().required().messages({
    "any.required": "Ngày kết thúc là bắt buộc",
  }),
  quantity: Joi.number().min(1).required().messages({
    "any.required": "Số lượng là bắt buộc",
    "number.min": "Số lượng phải lớn hơn 0",
  }),
  minPurchaseAmount: Joi.number().min(0).default(0),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const addDiscount = async (req, res) => {
    const { error } = discountSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((item) => item.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ messages });
      
    }
  
    try {
      const newDiscount = new DiscountCode(req.body);
      await newDiscount.save();
      res.status(StatusCodes.CREATED).json({ discount: newDiscount });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Đã xảy ra lỗi khi thêm mã giảm giá', error: err.message });
    }
  };
export const updateDiscountCode = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedDiscountCode = await DiscountCode.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedDiscountCode) {
            return res.status(404).json({ message: 'Discount code not found' });
        }

        res.status(200).json(updatedDiscountCode);
    } catch (error) {
        res.status(400).json({ message: 'Error updating discount code', error });
    }
};
export const deleteDiscountCode = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDiscountCode = await DiscountCode.findByIdAndDelete(id);

        if (!deletedDiscountCode) {
            return res.status(404).json({ message: 'Discount code not found' });
        }

        res.status(200).json({ message: 'Discount code deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting discount code', error });
    }
};
export const getDiscountCodes = async (req, res) => {
    try {
        const discountCodes = await DiscountCode.find();
        res.status(200).json(discountCodes);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching discount codes', error });
    }
};
