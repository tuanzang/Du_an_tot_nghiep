import mongoose from "mongoose";

const productSizeSchema = new mongoose.Schema(
  {
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    idSize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizeName: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: ẩn, 1: hiện,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("ProductSize", productSizeSchema);
