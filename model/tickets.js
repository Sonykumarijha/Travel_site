import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Store as ObjectId
            ref: 'User', // Reference the User model
            required: true
        },
        package_id: {
            type: mongoose.Schema.Types.ObjectId, // Store as ObjectId
            ref: 'Package', // Reference the Package model
            required: true
        },
        ticketCreationDate: {
            type: Date,
            default: Date.now // Simplified default function
        },
        subject: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ['CREATED', 'INPROGRESS', 'RESOLVED'],
            default: 'CREATED'
        },
    }, 
    {
        timestamps: true,
        versionKey: false
    }
);

const ticketModel = mongoose.model("Ticket", ticketSchema);
export default ticketModel;
