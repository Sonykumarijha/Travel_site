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
            enum: ['CREATED','ASSIGNED', 'INPROGRESS', 'RESOLVED'],
            default: 'CREATED'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        assignedAgent: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference the User model
            default: null 
        },
        resolutionDetails: {
            type: String,
            default: "" 
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Middleware to validate assignedAgent role before saving
ticketSchema.pre('save', async function (next) {
    if (this.assignedAgent) {
        const User = mongoose.model('User'); // Access the User model
        const agent = await User.findById(this.assignedAgent);

        if (!agent || agent.role !== 'AGENT') {
            const err = new Error('The assigned user must have a role of AGENT');
            return next(err);
        }
    }
    next();
});

const ticketModel = mongoose.model("Ticket", ticketSchema);
export default ticketModel;
