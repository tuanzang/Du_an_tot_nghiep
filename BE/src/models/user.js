import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 20,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "../upload/default-avatar.jpeg",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
