import cron from "node-cron";
import Order from "../models/order.js";
import dayjs from "dayjs";
import { handleCompleteOrder } from "../controller/order.js";
import HistoryBill from "../models/historyBill.js";

const TIME_TO_EXPIRE = 1; // minute

const handleAutoCompleteOrder = async (io) => {
    try {
        const deliveredOrder = await Order.find({ status: 5 }).sort('-createdAt');

        for await (const order of deliveredOrder) {
            const expireTime = dayjs(order.updatedAt).add(TIME_TO_EXPIRE, "m");

            const isExpiredTime = dayjs(expireTime).diff(dayjs()) <= 0;

            if (isExpiredTime) {
                const updatedOrder = await Order.findByIdAndUpdate(order._id, { status: 6 }, { new: true }).populate('userId').exec();
                await handleCompleteOrder({ email: updatedOrder?.userId?.email, customerName: updatedOrder?.customerName });

                const dataHistoryBill = {
                    idUser: '',
                    idBill: updatedOrder._id,
                    creator: 'System',
                    role: 'admin',
                    statusBill: updatedOrder.status,
                    note: '',
                    createdAt: "",
                };

                await new HistoryBill(dataHistoryBill).save();

                io.emit('update order status', updatedOrder._id);
                io.emit('user update order status', updatedOrder._id);

                console.log('Auto complete order', updatedOrder._id);
            }
        }
    } catch (error) {
        console.log(error);
        console.log('Complete order error');
    }
}

const initialCronJob = (io) => {
    cron.schedule("*/10 * * * * *", () => {
        handleAutoCompleteOrder(io);
    });
};

export default initialCronJob;