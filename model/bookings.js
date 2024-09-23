// const mongoose = require('mongoose');

import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        },
        package_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Package',
            required: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true,
           unique: true,
            validate: {
                validator: function(value) {
                    // Example: Validate if the phone number has exactly 10 digits
                    return /^[0-9]{10}$/.test(value.toString());
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        email:{
            type: String,
            required: true,
            unique: true,

        },
        address:{
            type: String,
            required: false

        },
        bookingDate: {
            type: Date,
            default: () => Date.now()
        },

        tripStartDate: {
            type: Date,
            required: true
        },
        tripEndDate: {
            type: Date,
            required: false
        },
        numberOfGuests: {
            type: Number,
            required: true,
            min: 1
        },
        totalPrice: {
            type: Number,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
            default: 'PENDING'
        },
        bookingStatus: {
            type: String,
            enum: ['CONFIRMED', 'PENDING', 'CANCELLED', 'FINISHED'],
            default: 'PENDING'
        },
        meta: {
            type: Object,
            required: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const bookingModel = mongoose.model("Booking", bookingSchema)
export default bookingModel

