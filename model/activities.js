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

const activitySchema = new Schema(
    {
        title: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            require: true
        },
        review: {
            type: reviewSchema,
            required: false,
            default: []
        },
        activity_type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
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

const activityModel = mongoose.model("Activity", activitySchema)
export default activityModel