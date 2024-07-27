import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    code: {
      type: String,
      require: true,
    },
    products: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        size: String,
        variantId: String,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
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
    // email: {
    //   type: String,
    //   required: true,
    // },
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
