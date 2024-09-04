import express from "express";
import { createPackage, deletePackage, getAllPackages, getCount, getPackage, getPackagesByDestination, getPackagesByDestinationAndType, getPackagesByType, updatedPackage } from "../controller/packageController.js";
import upload from "../helpers/multer.js";

const router = express.Router()

const parseFormData = (req, res, next) => {
    if (req.body.day_plan) {
        try {
            req.body.day_plan = JSON.parse(req.body.day_plan);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid day_plan format' });
        }
    }
    if (req.body.meta) {
        try {
            req.body.meta = JSON.parse(req.body.meta);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid meta format' });
        }
    }
    next();
};
router.post("/", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]), parseFormData, createPackage);

//router.post("/", upload.single('image'), parseFormData,createPackage)
router.get("/id/:id", getPackage) 
router.get("/all",getAllPackages)
//router.put("/:id",upload.single('image'), updatedPackage)
router.put("/:id", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]), parseFormData, updatedPackage);


router.delete("/:id",deletePackage) 

router.get("/packagetype",getPackagesByType)
router.get("/destination",getPackagesByDestination)
router.get("/destinationandtype",getPackagesByDestinationAndType)

router.get("/count",getCount)




export default router

//---------------------

// {
//     "title": "Amazing Goa Tour",
//     "description": "Experience the best of Goa in 3 days",
//     "duration": "3",
//     "destination": "Goa",
//     "origin": "Delhi",
//     "price": 50000,
//     "day_plan": {
//         "day_1": {
//             "flight": {
//                 "title": "Delhi to Goa -Dabolim airport",
//                 "name": "Indigo",
//                 "origin": "Delhi",
//                 "destination": "Goa",
//                 "departureTime": "02pm",
//                 "arrivalTime": "04:25pm",
//                 "travelTime": "2h 25m"
//             },
//             "transfer": {
//                 "title": "Airport to Hotel",
//                 "name": "Private Transfer",
//                 "description": "Travel comfortably in a private vehicle from your hotel in North Goa to Dabolim Airport. Note: The pick-up timing is subject to your flight/train arrival and shall be communicated to you by the local vendor. There will be no stop-over allowed during this transfer."
//             },
//             "resort": {
//                 "title": " night in Goa",
//                 "name": "Summit Calangute Resort & Spa",
//                 "rating": "5",
//                 "check_in": "2pm",
//                 "check_out": "12pm",
//                 "meta": "breakfast included"
//             }
//         },
//         "day_2": {
//             "activity": {
//                 "title": "9 hours in Goa",
//                 "name": "South Goa Sightseeing (Private Transfers)",
//                 "description": "Pristine beaches, Portuguese architecture, shopping and the old world charm - South Goa offers it all Visit Shree Manguesh Temple, Old Goa Churches - Ce Cathedral and Basilica of Bom Jesus. Enjoy shopping at Panjim, Dona Paula (Please note that Taxis are not allowed to go till the jetty and will wait 1km away from the jetty infront of CBI office or designated parking area, client will have to walk for that stretch) & Miramar Beach and relish a Goan lunch at Spice Plantation at your own cost. Please note that Spice Plantation is operational from October to May only.",
//                 "duration": "9 hours",
//                 "meta": "Pick up and Drop is included"
//             },
//             "meal": {
//                 "title": "breakfast in Goa",
//                 "meta": "included with hotel"
//             }
//         },
//         "day_3": {
//             "activity": {
//                 "title": "5 hours in Goa",
//                 "name": "North Goa Sightseeing (Private Transfers)",
//                 "description": "Pristine beaches, Portuguese architecture, shopping and the old world charm - South Goa offers it all Visit Shree Manguesh Temple, Old Goa Churches - Ce Cathedral and Basilica of Bom Jesus. Enjoy shopping at Panjim, Dona Paula (Please note that Taxis are not allowed to go till the jetty and will wait 1km away from the jetty infront of CBI office or designated parking area, client will have to walk for that stretch) & Miramar Beach and relish a Goan lunch at Spice Plantation at your own cost. Please note that Spice Plantation is operational from October to May only.",
//                 "duration": "5 hours",
//                 "meta": "Pick up and Drop is included"
//             },
//             "meal": {
//                 "title": "breakfast in Goa",
//                 "meta": "included with hotel"
//             }
//         },
//         "day_4": {
//             "meal": {
//                 "title": "breakfast in Goa",
//                 "meta": "included with hotel"
//             },
//             "hotel_checkout": "Hotel Check out in Goa",
//             "transfer": {
//                 "title": " Hotel to Airport",
//                 "name": "Private Transfer",
//                 "description": "Travel comfortably in a private vehicle from your hotel in North Goa to Dabolim Airport. Note: The pick-up timing is subject to your flight/train arrival and shall be communicated to you by the local vendor. There will be no stop-over allowed during this transfer."
//             },
//             "flight": {
//                 "title": "Goa -Dabolim airport to Delhi",
//                 "name": "Indigo",
//                 "origin": "Goa",
//                 "destination": "Delhi",
//                 "departureTime": "02pm",
//                 "arrivalTime": "04:25pm",
//                 "travelTime": "2h 25m"
//             }
//         }
//     },
//     "meta": "meta data"
// }