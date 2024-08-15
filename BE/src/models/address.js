import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    provinceId: {
      type: Number,
      required: true,
    },
    provinceName: {
      type: String,
      required: true,
    },
    districtId: {
      type: Number,
      required: true,
    },
    districtName: {
      type: String,
      required: true,
    },
    wardId: {
      type: Number,
      required: true,
    },
    wardName: {
      type: String,
      required: true,
    },
    specifically: {
      type: String,
      required: true,
    },
    isDefault: {
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

export default mongoose.model("address", addressSchema);
