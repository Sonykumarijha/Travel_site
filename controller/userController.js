import userModel from "../model/users.js"
import bcrypt from "bcrypt"
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import cloudinary from "../helpers/cloudinary.js";
import nodemailer from 'nodemailer';
//import AWS from "aws-sdk"

import { getRandomSixDigit } from "../helpers/randomValues.js";




export const createUser = async (req, res, next) => {

    try {
        const { name, email, phone, password,confirmPassword,role } = req.body
        const image = req.file ? req.file.path : null;
        let user;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({message: "password and confirm password must be same"})
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        let hashedPassword = await bcrypt.hash(password, 10)
        if (role == "AGENT") {
            
                 user = await userModel.create({ name, email, phone, password: hashedPassword, image, role, agent_status: "OFFLINE" })

        }else{
            
               user = await userModel.create({ name, email, phone, password: hashedPassword, image, role })

        }
        

        // let user = await userModel.create({ name, email, phone, password: hashedPassword, image, role })


        // Upload image to Cloudinary
        if (image) {
            const result = await cloudinary.uploader.upload(image);
            user = await userModel.findByIdAndUpdate(user._id, {image_url:result.secure_url}, {new:true})
        }

     

        return res.status(201).json({ message: 'user created successfully', user})

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

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, phone, password } = req.body;
        let newImage = user.image;  // Default to existing image
        let imageUrl = user.image_url;  // Default to existing image URL

        // Check if a new image file is provided
        if (req.file) {
            newImage = req.file.path;

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload(newImage);
            imageUrl = result.secure_url;

            // Delete the old image file if a new one is provided
            if (newImage && user.image) {
                const oldImagePath = path.join('uploads/', '..', user.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete old image:', err);
                    }
                });
            }
        }

        const data = {
            name: name || user.name,
            phone: phone || user.phone,
            password: password || user.password,
            image: newImage,
            image_url: imageUrl
        };

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

export const getAllUsers = async (req,res,next) => {
    try {
        let users = await userModel.find({role:"CUSTOMER"})
        return res.status(200).json({users})
        
    } catch (error) {
        next(error)
    }
}

export const getAllAgent = async (req,res,next) => {
    try {
        let agents = await userModel.find({role:"AGENT"})
        return res.status(200).json({agents})
        
    } catch (error) {
        next(error)
    }
}

export const getAvailableAgents = async (req,res,next) => {
    try {
        let agents = await userModel.find({role:"AGENT",agent_status:"AVAILABLE"}).limit(10)
        return res.status(200).json({agents})
        
    } catch (error) {
        next(error)
    }
}

export const updateAgentStatus = async (req,res,next) => {
    console.log('_______insider updateAgentStatus');
    
    try {
        let agentId = req.params.id
        console.log(agentId,'_____agentId');
        
        let {agent_status} = req.body
        console.log(agent_status,'___agent_status');
        

        if (!agentId) {
            return res.status(400).json({message: "invalid payload"})
        }

        let agent = await userModel.findById(agentId)
        
        if (!agent) {
            return res.status(400).json({message: "no agent found"})

        }

        await userModel.findByIdAndUpdate(
            agentId,
            { agent_status: agent_status },
            { new: true }
        );
        

        return res.status(200).json({message: "updated successfully"})
    } catch (error) {
        next(error)

    }
}


export const getCustomerCount = async (req, res, next) => {
    try {
        // Count the number of users with the role 'CUSTOMER'
        let userCount = await userModel.countDocuments({ role: 'CUSTOMER' });

        return res.status(200).json({
            userCount
        });
    } catch (error) {
        next(error);
    }
}

export const getAgentCount = async (req, res, next) => {
    try {
        let agentCount = await userModel.countDocuments({ role: 'AGENT' });

        return res.status(200).json({
            agentCount
        });
    } catch (error) {
        next(error);
    }
}



// // Configure AWS SDK
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION // Set your region
// });

// export const createUser = async (req, res, next) => {
//     try {
//         const { name, email, phone, password, role } = req.body;
//         const image = req.file ? req.file.path : null;

//         if (!name || !email || !phone || !password) {
//             return res.status(400).json({ message: 'Invalid payload' });
//         }
//         if (!/^\S+@\S+\.\S+$/.test(email)) {
//             return res.status(400).json({ message: 'Invalid email format' });
//         }

//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         let hashedPassword = await bcrypt.hash(password, 10);
        
//         // Create user in DB without image URL
//         let user = await userModel.create({ name, email, phone, password: hashedPassword, role });

//         if (image) {
//             // Read the image file from the file system
//             const fileContent = fs.readFileSync(image);
            
//             // Set up S3 upload parameters
//             const params = {
//                 Bucket: process.env.AWS_S3_BUCKET_NAME, // Your bucket name
//                 Key: `users/${user._id}/${Date.now()}_${req.file.originalname}`, // File name you want to save as in S3
//                 Body: fileContent,
//                 ContentType: req.file.mimetype // MIME type of the file
//             };

//             // Uploading files to the bucket
//             const s3Result = await s3.upload(params).promise();
            
//             // Update user with image URL from S3
//             user = await userModel.findByIdAndUpdate(user._id, { image_url: s3Result.Location }, { new: true });
//         }

//         return res.status(200).json({ message: 'User created successfully', user });

//     } catch (error) {
//         next(error);
//     }
// };