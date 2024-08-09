import mongoose, { Schema } from "mongoose";

const contactchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        meta: {
            type: Object,
            required: false


        },

    },

    {
        versionKey: false,
        timestamps: true
    }
)

const contactModel = mongoose.model("Contact", contactchema)
export default contactModel