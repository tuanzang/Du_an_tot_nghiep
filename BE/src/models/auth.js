import mongoose from "mongoose";


const authSchema = new mongoose.Schema(
{
    image: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
})


export default mongoose.model("Auth", authSchema)