import express from "express";
import { createPackage, deletePackage, getPackage, updatedPackage } from "../controller/packageController.js";

const router = express.Router()

router.post("/", createPackage)
 router.get("/:id", getPackage) 
router.put("/:id", updatedPackage)
router.delete("/:id",deletePackage)




export default router