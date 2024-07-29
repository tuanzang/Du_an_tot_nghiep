import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    // price: {
    //     type: Number,
    //     required: true
    // },
    // priceOld: {
    //     type: Number,
    //     required: true
    // },
    description: {
      type: String,
      required: true,
    },
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
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

export default mongoose.model("Product", productSchema);
