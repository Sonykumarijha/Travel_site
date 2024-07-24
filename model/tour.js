import mongoose, { Schema } from "mongoose";

const tourSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        destination: {
            type: String,
            require: true
        },
        price:{
            type: Number,
            required: true
        },
        startDate:{
            type: Date,
            required: true

            
        },
        endDate:{
            type: Date,
            required: true

            
        },
      
    },
    
    {
        versionKey:false,
        timestamps:true
    }
)

const tourModel = mongoose.model("Tour",tourSchema)
export default tourModel