import express from "express"
import { createContact, deleteContact, getAllContact, getContact, updateContact } from "../controller/contactController.js";

const router = express.Router()

router.post("/", createContact)
router.put("/:id", updateContact)
router.delete("/:id", deleteContact)
router.get("/id/:id", getContact)
router.get("/all", getAllContact)



export default router;