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

const carSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        seats:{
            type: Number,
            required: true
        },
        type: {
            type: String,
            require: true
        },
        tankCapacity:{
            type: Number,
            required: true
        },
        price:{
            type: Number,
            required: true
                
        },
        review: {
            type: reviewSchema,
            required: false,
            default: []
        },
        meta:{
            type: Object,

            
        },

      
    },
    
    {
        versionKey:false,
        timestamps:true
    }
)

const carModel = mongoose.model("Car",carSchema)
export default carModel