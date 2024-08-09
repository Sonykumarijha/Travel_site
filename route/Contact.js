import express from "express"
import { createContact } from "../controller/contactController.js";
//import { createCar, deleteCar, getCar, getCarsByRating, updateCar } from "../controller/carController.js";

const router = express.Router()

router.post("/", createContact)
// router.put("/:id", updateCar)
// router.delete("/:id", deleteCar)
// router.get("/carbyid/:id", getCar)
// router.get("/byrating",getCarsByRating)



export default router;