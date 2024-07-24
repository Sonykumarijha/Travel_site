import express from "express";
import { createActivity, deleteActivity, getActivityByLocation, updateActivity } from "../controller/activityController.js";

const router = express.Router()

router.post("/", createActivity)
router.get("/bylocation", getActivityByLocation) 
router.put("/:id", updateActivity)
router.delete("/:id",deleteActivity)




export default router