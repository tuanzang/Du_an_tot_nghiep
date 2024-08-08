import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idBill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },
    transCode: {
      type: String,
    },
    type: {
      type: Boolean,
      required: true,
    },
    totalMoney: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Transaction", transactionSchema);
