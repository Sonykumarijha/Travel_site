import userModel from "../model/users.js"
import bcrypt from "bcrypt"
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import cloudinary from "../helpers/cloudinary.js";
import nodemailer from 'nodemailer';

import { getRandomSixDigit } from "../helpers/randomValues.js";

export const createUser = async (req, res, next) => {

    try {
        const { name, email, phone, password } = req.body
        const image = req.file ? req.file.path : null;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        let hashedPassword = await bcrypt.hash(password, 10)

        let user = await userModel.create({ name, email, phone, password: hashedPassword, image })


        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image);

        return res.status(200).json({ message: 'user created successfully', user: user, imageUrl: result.secure_url })

    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        let user = await userModel.findById(userId)
        return res.status(200).json({ user: user })
    } catch (error) {
        next(error);
    }

}

export const updateUser = async (req, res,next) => {
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const { name, phone, password } = req.body;
        const newImage = req.file ? req.file.path : null;

        const data = {
            name: name,
            phone: phone,
            password: password,
            image: newImage
        }

        if (newImage && user.image) {
            const oldImagePath = path.join('uploads/', '..', user.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Failed to delete old image:', err);
                }
            });
        }


        const updatedUser = await userModel.findByIdAndUpdate(userId, data, { new: true });

        return res.status(200).json({ message: "Updated successfully", updatedUser: updatedUser });
    } catch (error) {
        next(error);
    }
};


export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        await userModel.findByIdAndDelete(userId)
        return res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        next(error);

    }

}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const updateUser = await userModel.findByIdAndUpdate(user._id, { $set: { access_token: token } }, { new: true })

        return res.status(200).json({ message: "Login Successfully", token: token });
    } catch (error) {
        next(error);
    }
};

 export const resetPassword = async (req, res, next) => {
        try {
            const { email } = req.body

            if (!email) {
                return res.status(400).json({ message: 'Email is required' })
            }

            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: "No user exist with this email" })
            }

            let randomSixDigit = getRandomSixDigit();

            const updatedUser = await userModel.findByIdAndUpdate(
                user._id,
                { otp: randomSixDigit },
                { new: true, timestamps: true } 
            );



            //_________________________________________________________ SEND EMAIL _________________________________________________________

            //let testAccount = await nodemailer.createTestAccount()
            
            const transporter = nodemailer.createTransport({
                host: process.env.ETHEREAL_HOST,
                port: 587,
                auth: {
                    user: process.env.ETHEREAL_USER,
                    pass: process.env.ETHEREAL_PASSWORD
                }
            });

            const info = await transporter.sendMail({
                from: process.env.ETHEREAL_USER, 
                to: "sony@mailinator.com",
                subject: 'Your OTP Code',
                text: `Your OTP code is ${updatedUser.otp}`, 
                html: "<b>Hello world****************?</b>", 
              });

              console.log(info.messageId,'__message sent on this id');

            //____________________________________________________________________________________________________________________



            return res.status(200).json({ message: "otp sent successfully", otp: updatedUser.otp, info })
        
        } catch (error) {
            next(error);
        }
    }


export const verifyOtp = async (req,res, next) => {
    try {
        let {email,otp} = req.body
        if (!otp || !email) {
            return res.status(400).json({message: "payloadss required"})
        }
        let user = await userModel.findOne({email})

        if (!user) {
            return res.status(400).json({message: " no user found"})
        }

        const otpExpiryTime = 3 * 60 * 1000; // 3 minutes in milliseconds
        const currentTime = new Date();
        const otpGeneratedAt = new Date(user.updatedAt);
        const timeDifference = currentTime - otpGeneratedAt;

        if (timeDifference > otpExpiryTime) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (user.otp !== parseInt(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        return res.status(400).json({message: "otp verify successfully", user})
    } catch (error) {
        next(error);
    }
}

export const resetNewPassword = async (req,res, next) => {
    try {
        const {email, new_password} = req.body
        let user = await userModel.findOne({email})
        if (!user) {
            return res.status(400).json({message: "user not found"})
        }
        let hashedPassword = await bcrypt.hash(new_password, 10)
        let updatedUser = await userModel.findByIdAndUpdate(user._id, {password: hashedPassword},{new:true})
        return res.status(200).json({message: "New password reset successfully"})
    } catch (error) {
        next(error);
    }
}




