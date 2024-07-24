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

const hotelSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        located: {
            country: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            address: {
                type: String,
                required: true
            },
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        distance: {
            type: String,
            required: false
        },
        review: {
            type: reviewSchema,
            required: true,
            default: []
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        meta: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const hotelModel = mongoose.model("Hotel", hotelSchema);
export default hotelModel;
