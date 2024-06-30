import mongoose from "mongoose";

const { Schema } = mongoose
const Size = new Schema({
    size: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("size", Size)