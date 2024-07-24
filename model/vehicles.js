import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema(
    {
        role: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        origin: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        departureTime: {
            type: String,
            require: true
        },
        arrivalTime: {
            type: String,
            required: true
        },
        travelTime: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true

        },
        meta: {
            type: Object,
            required: true


        },

    },

    {
        versionKey: false,
        timestamps: true
    }
)

const vehicleModel = mongoose.model("Vehicle", vehicleSchema)
export default vehicleModel