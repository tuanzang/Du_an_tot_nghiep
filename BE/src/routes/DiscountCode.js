import express from 'express';
import {
    addDiscount,
    updateDiscountCode,
    deleteDiscountCode,
    getDiscountCodes,
    // getDiscountCode
} from '../controller/DiscountCode.js';

const DiscountCode = express.Router();

// Định nghĩa các route tương ứng với các chức năng
DiscountCode.post('/discountCodes', addDiscount); // Tạo mã giảm giá mới
DiscountCode.put('/discountCodes/:id', updateDiscountCode); // Sửa mã giảm giá
DiscountCode.delete('/discountCodes/:id', deleteDiscountCode); // Xóa mã giảm giá
DiscountCode.get('/discountCodes', getDiscountCodes); // Lấy tất cả mã giảm giá
// router.get('/discountCodes/:id', getDiscountCode); // Lấy mã giảm giá cụ thể

export default DiscountCode;
