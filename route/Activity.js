import express from "express";
import { createActivity, deleteActivity, getActivitiesByName, getActivityByLocation, updateActivity } from "../controller/activityController.js";

const router = express.Router()

router.post("/", createActivity)
router.get("/bylocation", getActivityByLocation) 
router.put("/:id", updateActivity)
router.delete("/:id",deleteActivity)

router.get("/name",getActivitiesByName)




export default router