import mongoose from "mongoose";

const productSizeSchema = new mongoose.Schema(
    {
        idProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        idSize  : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Size",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        sizeName: {
            type: String,
            required: true
        }
    }, {
        timestamps: true,
        versionKey: false
    }
);


export default mongoose.model("ProductSize", productSizeSchema)