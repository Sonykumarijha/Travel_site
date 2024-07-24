import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        phone: {
            type: Number,
            require: true
        },
        password:{
            type: String,
            required: true
        },
        image:{
            type: String,

            
        },
        access_token: {
            type: String
        },
        otp: {
            type: Number,
            required: false

        }
              
    },
    
    {
        versionKey:false,
        timestamps:true
    }
)

const userModel = mongoose.model("User",userSchema)
export default userModel