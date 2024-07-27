import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    products: [
      {
        product: String,
        quantity: Number,
        variant: {
          type: mongoose.Types.ObjectId,
          ref: "ProductSize",
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("cart", cartSchema);
