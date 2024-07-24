import express from "express"
import { createVehicle, deleteVehicle,  getFlightByDestination, getTrainByDestination, getVehicle,  updateVehicle } from "../controller/vehicleController.js";

const router = express.Router()

router.post("/", createVehicle)

router.get("/flightByDestination",getFlightByDestination)
router.get("/trainByDestination",getTrainByDestination)


router.get("/:id",getVehicle)


router.put("/:id",updateVehicle)
router.delete("/:id",deleteVehicle)


export default router;