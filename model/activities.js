import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        locaton:{
            type: String,
            required: true
        },
        price: {
            type: Number,
            require: true
        },
                
    },
    
    {
        versionKey:false,
        timestamps:true
    }
)

const activityModel = mongoose.model("Activity",activitySchema)
export default activityModel