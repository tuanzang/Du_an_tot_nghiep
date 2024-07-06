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
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Product", productSchema);
