import express from "express"
import { createTicket, deleteTicket, getAllTicket, getCount, getTicket, updateTicket } from "../controller/ticketController.js";

const router = express.Router()

router.post("/", createTicket)
router.put("/:id", updateTicket)
router.delete("/:id", deleteTicket)
router.get("/id/:id", getTicket)
router.get("/all",getAllTicket)

router.get("/count",getCount)



export default router;