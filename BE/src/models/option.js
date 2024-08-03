import mongoose from "mongoose";
const optionCategorios = new mongoose.Schema(
    {
        category:{
            type: String,
            required: true,
        },
        nameoption:{
            type: String,
            required: true,
        },
        quantityoption:{
            type:Number,
            require:true
        },
        priceoption:{
            type:Number,
            require:true
        },
       status: {
      type: Number,
      enum: [0, 1], // 0: ẩn, 1: hiện,
      required: true,
      default: 1,
    },

    },
    {
        timestamps: true,
        versionKey: false,
      }
)

export default mongoose.model("option", optionCategorios);