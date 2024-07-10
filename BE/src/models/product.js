import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
<<<<<<< HEAD
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
        description: {
            type: String,
            required: true
        },
        categoryId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            }
        ]
    }, {
        timestamps: true,
        versionKey: false
    }
);

=======
  {
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
>>>>>>> 4a750a9f47f8095b0286710a0234a58ecb7a0e94

export default mongoose.model("Product", productSchema);
