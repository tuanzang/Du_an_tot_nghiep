import mongoose from "mongoose";
const optionCategorios = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: ẩn, 1: hiện,
      required: true,
      default: 1,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Option", optionCategorios);
