import mongoose from "mongoose";

const { Schema } = mongoose
// const Size = new Schema({
//     sizeCode: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     products: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Product"

//         }
//     ],
//     // status: {
//     //     type: Boolean,
//     //     default: true,
//     // },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// })

const Size = new Schema(
    {
        sizeCode: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true
        }

    }, {
        timestamps: true,
        versionKey: false
    }
);


export default mongoose.model("size", Size)
