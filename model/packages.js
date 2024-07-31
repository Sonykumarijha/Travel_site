import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    {
        _id: false,
        timestamps: true
    }
);

const packageSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            require: true
        },
        destination: {
            type: String,
            require: true
        },
        origin: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            require: true
        },
        day_plan: {
            type: Object,
            require: true
        },
        review: {
            type: reviewSchema,
            required: false,
            default: []
        },
        meta: {
            type: Object,
            required: false,
        },

    },

    {
        versionKey: false,
        timestamps: true
    }
)

const packageModel = mongoose.model("Package", packageSchema)
export default packageModel