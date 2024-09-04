import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['ADMIN', 'CUSTOMER', 'AGENT'],
            default: 'CUSTOMER'
        },
        email:{
            type: String,
            required: true,
            unique: true,

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
        password:{
            type: String,
            required: true
        },
       
        image:{
            type: String,
         
        },
        image_url:{
            type: String,
            
        },
        access_token: {
            type: String
        },
        otp: {
            type: Number,
            required: false

        },
        agent_status: {
            type: String,
            required: false,
            enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
            //default: 'OFFLINE'
        },
              
    },
    
    {
        versionKey:false,
        timestamps:true
    }
)

const userModel = mongoose.model("User",userSchema)
export default userModel
