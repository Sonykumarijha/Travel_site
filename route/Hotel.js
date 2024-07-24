import express from "express"
import { createHotel,  deleteHotel, getHotel,  getHotelsByPrice,  getHotelsByRating,  updateHotel, } from "../controller/hotelController.js";

const router = express.Router()

router.post("/", createHotel)

router.get("/byrating", getHotelsByRating) 
router.get("/byprice", getHotelsByPrice) 


router.get("/:id", getHotel)
router.put("/:id",updateHotel)
router.delete("/:id",deleteHotel)

export default router;