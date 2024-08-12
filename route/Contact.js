import express from "express"
import { createContact, deleteContact, getContact, updateContact } from "../controller/contactController.js";

const router = express.Router()

router.post("/", createContact)
router.put("/:id", updateContact)
router.delete("/:id", deleteContact)
router.get("/byid/:id", getContact)



export default router;