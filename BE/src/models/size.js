import mongoose from "mongoose";

const { Schema } = mongoose;

const Size = new Schema(
  {
    sizeCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("size", Size);
