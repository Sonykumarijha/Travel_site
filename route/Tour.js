import express from "express";
import { createTour, deleteTour, getTour, getTourByDestination, getHealthAndWellnessTours, updateTour, getFestiveAndCultureTours, getToursByType } from "../controller/tourController.js";

const router = express.Router()

router.post("/", createTour)
router.get("/bydestination", getTourByDestination) //TASK 1
router.get("/tour/:id",getTour)
router.put("/:id", updateTour)
router.delete("/:id",deleteTour)
router.get("/type",getToursByType)

router.get("/healthandwellness",getHealthAndWellnessTours)
router.get("/festiveandculture",getFestiveAndCultureTours)





export default router