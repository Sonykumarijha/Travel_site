import express from "express"
import { createBooking, deleteBooking, getAllBooking, getBooking, updateBooking } from "../controller/bookingController.js";

const router = express.Router()

router.post("/", createBooking)
router.put("/:id", updateBooking)
router.delete("/:id", deleteBooking)
router.get("/id/:id", getBooking)
router.get("/all",getAllBooking)



export default router;