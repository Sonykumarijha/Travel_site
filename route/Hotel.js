import express from "express"
import multer from "multer";

import { createHotel,  deleteHotel, getAllHotels, getHotel,  getHotelsByPrice,  getHotelsByRating,    updateHotel, } from "../controller/hotelController.js";
import upload from "../helpers/multer.js";

const router = express.Router()



// Middleware to parse nested form-data

const parseFormData = (req, res, next) => {
    if (req.body.located) {
        try {
            req.body.located = JSON.parse(req.body.located);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid located format' });
        }
    }
    if (req.body.review) {
        try {
            req.body.review = JSON.parse(req.body.review);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid review format' });
        }
    }
    next();
};



//router.post("/",upload.single('image'), parseFormData,createHotel)

//router.get("/byrating", getHotelsByRating) 
//router.get("/byprice", getHotelsByPrice) 


//router.get("/:id", getHotel)
//router.put("/:id",upload.single('image'), parseFormData, updateHotel)
//router.delete("/:id",deleteHotel)

router.get("/bycity",getAllHotels)


//router.get("/city", HotelsBYCity)

 
export default router;

//http://localhost:8000/hotels?city=Shimla&radius=10