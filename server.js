import express from "express";
import bodyParser from "body-parser";
import connectMongodb from "./mongo.js";
import dotenv from 'dotenv';
import cors from 'cors';
import tourRouter from "./route/Tour.js";
import hotelRouter from "./route/Hotel.js";
import vehicleRouter from "./route/Vehicle.js";
import carRouter from "./route/Car.js";
import activityRouter from "./route/Activity.js";
import packageRouter from "./route/Package.js";
import contactRouter from "./route/Contact.js";
import userRouter from "./route/User.js";
import bookingRouter from "./route/Booking.js";
import ticketRouter from "./route/Tickets.js";
import bookingModel from './model/bookings.js';
import errorHandler from "./helpers/error_middleware.js";
import userModel from "./model/users.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send('backend server*****');
});

app.use("/tours", tourRouter);
app.use("/hotels", hotelRouter);
app.use("/vehicles", vehicleRouter);
app.use("/cars", carRouter);
app.use("/activities", activityRouter);
app.use("/packages", packageRouter);
app.use("/contacts", contactRouter);
app.use("/bookings", bookingRouter);
app.use("/tickets", ticketRouter);
app.use("/users", userRouter);





app.post('/webhook', async (req, res) => {
    
    const { queryResult } = req.body;
    const intent = queryResult.intent.displayName;
    const parameters = queryResult.parameters;

    try {
        if (intent === 'GetUserDetails') {
            let userId = parameters.userId;
            console.log('Received userId:', userId); // Debugging line
            
            // Extract the actual userId if it's embedded in a longer string
            const match = userId.match(/@userId:(\w{24})/);
            if (match) {
                userId = match[1];
            } else if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.json({
                    fulfillmentText: 'Invalid user ID format.',
                });
            }
            
            console.log(userId, '_____userId***');
            
            const user = await userModel.findOne({ _id: userId });
            console.log(user, '__user***');
            
            if (user) {
                res.json({
                    fulfillmentText: `User found: ${user.name}, Email: ${user.email}`,
                });
            } else {
                res.json({
                    fulfillmentText: `No user found with ID ${userId}.`,
                });
            }
        } else if (intent === 'CreateBooking') {
            const bookingData = {
                userId: parameters.userId,
                tripStartDate: parameters.tripStartDate,
                tripEndDate: parameters.tripEndDate,
                destination: parameters.destination,
                bookingStatus: 'PENDING', // Default status
                // other fields
            };
            const newBooking = new bookingModel(bookingData);
            await newBooking.save();
            res.json({
                fulfillmentText: 'Your booking has been successfully created.',
            });
        } else {
            res.json({
                fulfillmentText: 'This intent is not yet handled.',
            });
        }
    } catch (error) {
        console.error('Error handling intent:', error);
        res.json({
            fulfillmentText: `An error occurred: ${error.message}`,
        });
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

connectMongodb();





// import express from 'express';
// import bodyParser from 'body-parser';
// import connectMongodb from './mongo.js';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cron from 'node-cron';

// import tourRouter from './route/Tour.js';
// import hotelRouter from './route/Hotel.js';
// import vehicleRouter from './route/Vehicle.js';
// import carRouter from './route/Car.js';
// import activityRouter from './route/Activity.js';
// import packageRouter from './route/Package.js';
// import contactRouter from './route/Contact.js';
// import userRouter from './route/User.js';
// import bookingRouter from './route/Booking.js';
// import ticketRouter from './route/Tickets.js';

// import errorHandler from './helpers/error_middleware.js';
// import bookingModel from './model/bookings.js';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 8001;

// // Use CORS middleware
// app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.send('backend server*****');
// });

// app.use('/tours', tourRouter);
// app.use('/hotels', hotelRouter);
// app.use('/vehicles', vehicleRouter);
// app.use('/cars', carRouter);
// app.use('/activities', activityRouter);
// app.use('/packages', packageRouter);
// app.use('/contacts', contactRouter);
// app.use('/bookings', bookingRouter);
// app.use('/tickets', ticketRouter);
// app.use('/users', userRouter);

// app.use(errorHandler);

// // Cron job to automatically update bookingStatus to 'FINISHED'
// cron.schedule('0 0 * * *', async () => {
//     try {
//         const today = new Date();
//         const bookings = await bookingModel.updateMany(
//             { 
//                 tripEndDate: { $lt: today },
//                 bookingStatus: { $ne: 'FINISHED' }
//             },
//             { $set: { bookingStatus: 'FINISHED' } }
//         );
//         console.log(`Updated ${bookings.nModified} bookings to FINISHED status`);
//     } catch (error) {
//         console.error('Error updating booking status:', error);
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// // Connect to MongoDB
// connectMongodb();

