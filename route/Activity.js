import express from "express";
import { createActivity, deleteActivity, getActivitiesByName, getActivitiesByType, getActivityByLocation, updateActivity } from "../controller/activityController.js";
import { uploadSingleImage } from "../helpers/multer.js";

const router = express.Router()

router.post("/",uploadSingleImage.single('image'), createActivity)
router.get("/bylocation", getActivityByLocation) 
router.put("/:id",uploadSingleImage.single('image'), updateActivity)
router.delete("/:id",deleteActivity)

router.get("/name",getActivitiesByName)
router.get("/type",getActivitiesByType)




export default router