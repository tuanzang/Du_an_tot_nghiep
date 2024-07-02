import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    products: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      enum: [
        "Đặt hàng thành công",
        "Đã xác nhận",
        "Đang giao hàng",
        "Đã giao hàng",
        "Đã huỷ",
      ],
      type: String,
      default: "Đặt hàng thành công",
    },
    customerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY"],
      default: "COD",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("order", orderSchema);
