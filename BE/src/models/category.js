import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        size: {
            type: String,
            required: true
        },
        merterial: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default mongoose.model("Category", categorySchema)