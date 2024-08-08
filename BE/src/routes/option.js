import express from 'express';
import { addOption, updateOption, deleteOption, getOptionsByCategoryId } from '../controller/option';

const optionRouter = express.Router();

// Thêm một tùy chọn mới
optionRouter.post('/add', addOption);

// Cập nhật một tùy chọn hiện có
optionRouter.put('/:id', updateOption);

// Xóa một tùy chọn
optionRouter.delete('/:id', deleteOption);

// get option by category id
optionRouter.get('/:categoryId', getOptionsByCategoryId)

export default optionRouter;