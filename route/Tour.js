import express from "express";
import { createTour, deleteTour, getTourByDestination, updateTour } from "../controller/tourController.js";

const router = express.Router()

router.post("/", createTour)
router.get("/bydestination", getTourByDestination) //TASK 1
router.put("/:id", updateTour)
router.delete("/:id",deleteTour)




export default router