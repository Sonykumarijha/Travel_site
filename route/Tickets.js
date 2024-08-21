import express from "express"
import { createTicket, deleteTicket, getAllTicket, getTicket, updateTicket } from "../controller/ticketController.js";

const router = express.Router()

router.post("/", createTicket)
router.put("/:id", updateTicket)
router.delete("/:id", deleteTicket)
router.get("/id/:id", getTicket)
router.get("/all",getAllTicket)



export default router;