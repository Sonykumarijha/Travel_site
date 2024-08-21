// const mongoose = require('mongoose');

import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
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
    ticketCreationDate: {
        type: Date,
        default: () => Date.now()
    },
    
    subject: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: false
    },
  }, 
{
    timestamps: true,
    versionKey: false
}
);

const ticketModel = mongoose.model("Ticket",ticketSchema)
export default ticketModel

