import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: [
            {
                type: String,
                required: true
            }
        ],
        price: {
            type: Number,
            required: true
        },
        priceOld: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        categoryId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            }
        ],
        productSize: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductSize",
            },
        ],
    }, {
    timestamps: true,
    versionKey: false
}
);



export default mongoose.model("Product", productSchema);
