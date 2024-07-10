import mongoose from "mongoose";

const historyBillSchema = new mongoose.Schema(
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
    creator: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    statusBill: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("HistoryBill", historyBillSchema);
