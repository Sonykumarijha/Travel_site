
import express from 'express';
import bodyParser from 'body-parser';
import connectMongodb from './mongo.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';

import tourRouter from './route/Tour.js';
import hotelRouter from './route/Hotel.js';
import vehicleRouter from './route/Vehicle.js';
import carRouter from './route/Car.js';
import activityRouter from './route/Activity.js';
import packageRouter from './route/Package.js';
import contactRouter from './route/Contact.js';
import userRouter from './route/User.js';
import bookingRouter from './route/Booking.js';
import ticketRouter from './route/Tickets.js';

import errorHandler from './helpers/error_middleware.js';
import bookingModel from './model/bookings.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('backend server*****');
});

app.use('/tours', tourRouter);
app.use('/hotels', hotelRouter);
app.use('/vehicles', vehicleRouter);
app.use('/cars', carRouter);
app.use('/activities', activityRouter);
app.use('/packages', packageRouter);
app.use('/contacts', contactRouter);
app.use('/bookings', bookingRouter);
app.use('/tickets', ticketRouter);
app.use('/users', userRouter);

app.use(errorHandler);

// Cron job to automatically update bookingStatus to 'FINISHED'
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        const bookings = await bookingModel.updateMany(
            { 
                tripEndDate: { $lt: today },
                bookingStatus: { $ne: 'FINISHED' }
            },
            { $set: { bookingStatus: 'FINISHED' } }
        );
        console.log(`Updated ${bookings.nModified} bookings to FINISHED status`);
    } catch (error) {
        console.error('Error updating booking status:', error);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB
connectMongodb();


// import express from "express"
// import bodyParser from "body-parser"
// import connectMongodb from "./mongo.js"
// import dotenv from 'dotenv';
// dotenv.config();

// import cors from 'cors'

// import tourRouter from "./route/Tour.js"
// import hotelRouter from "./route/Hotel.js"
// import vehicleRouter from "./route/Vehicle.js"
// import carRouter from "./route/Car.js"
// import activityRouter from "./route/Activity.js"
// import packageRouter from "./route/Package.js"
// import contactRouter from "./route/Contact.js"
// import userRouter from "./route/User.js"
// import bookingRouter from "./route/Booking.js"
// import ticketRouter from "./route/Tickets.js"


// import errorHandler from "./helpers/error_middleware.js";



// const app = express()
// const port = process.env.PORT || 8001

// // Use CORS middleware
// app.use(cors());


// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

// app.get("/", (req,res) => {
//     res.send('backend server*****')
// })

// app.use("/tours", tourRouter)
// app.use("/hotels", hotelRouter)
// app.use("/vehicles", vehicleRouter)
// app.use("/cars", carRouter)
// app.use("/activities", activityRouter)
// app.use("/packages", packageRouter)
// app.use("/contacts", contactRouter)
// app.use("/bookings", bookingRouter)
// app.use("/tickets", ticketRouter)


// app.use("/users", userRouter)

// app.use(errorHandler);




// app.listen(port, () => {
//     console.log(`server is running on port ${port}`)
// })

// connectMongodb()