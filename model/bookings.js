// const mongoose = require('mongoose');

import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
    user_id: {
        type: String,
       // ref: 'User',
        required: true
    },
    package_id: {
        type: String,
        ref: 'Package',
        required: true
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
        required: true
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
        enum: ['CONFIRMED', 'PENDING', 'CANCELLED'],
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

const bookingModel = mongoose.model("Booking",bookingSchema)
export default bookingModel

