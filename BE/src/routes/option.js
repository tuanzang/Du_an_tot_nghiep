import express from 'express';
import { addOption, updateOption, deleteOption } from '../controller/option';

const optionRouter = express.Router();

// Thêm một tùy chọn mới
optionRouter.post('/add', addOption);

// Cập nhật một tùy chọn hiện có
optionRouter.put('/:id', updateOption);

// Xóa một tùy chọn
optionRouter.delete('/:id', deleteOption);

export default optionRouter;