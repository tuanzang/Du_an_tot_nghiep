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
        optionName: String,
        optionPrice: Number,
        optionId: String
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
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY"],
      default: "COD",
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discouVoucher: {
      type: Number,
      required: true,
    },
    discountCode: {
      type: String,
    },
    statusShip: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("order", orderSchema);
