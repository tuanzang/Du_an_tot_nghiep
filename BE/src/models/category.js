import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    loai: {
      type: String,
      required: true,
      unique: true,
    },
    status: { type: String },
    options: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Category", categorySchema);
