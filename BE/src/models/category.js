import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    loai: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Category", categorySchema);
