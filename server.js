import express from "express"
import bodyParser from "body-parser"
import connectMongodb from "./mongo.js"
import dotenv from 'dotenv';
dotenv.config();

import tourRouter from "./route/Tour.js"
import hotelRouter from "./route/Hotel.js"
import vehicleRouter from "./route/Vehicle.js"
import carRouter from "./route/Car.js"
import activityRouter from "./route/Activity.js"

import userRouter from "./route/User.js"


const app = express()
const port = process.env.PORT || 3003

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req,res) => {
    res.send('backend server*****')
})

app.use("/tours", tourRouter)
app.use("/hotels", hotelRouter)
app.use("/vehicles", vehicleRouter)
app.use("/cars", carRouter)
app.use("/activities", activityRouter)

app.use("/users", userRouter)



app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

connectMongodb()