import mongoose from "mongoose";

const connectMongodb = async (req,res) => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/db")
        console.log('***mongodb connected***');

    } catch (error) {
        console.log('mongodb not connected');
    }
}

export default connectMongodb;