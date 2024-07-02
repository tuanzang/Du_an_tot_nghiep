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
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("cart", cartSchema);
