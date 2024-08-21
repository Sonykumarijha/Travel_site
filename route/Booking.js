import express from "express"
import { cancelBooking, createBooking, deleteBooking, getAllBooking, getBooking } from "../controller/bookingController.js";

const router = express.Router()

router.post("/", createBooking)
router.put("/:id", cancelBooking)
router.delete("/:id", deleteBooking)
router.get("/id/:id", getBooking)
router.get("/all",getAllBooking)



export default router;