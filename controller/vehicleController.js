import vehicleModel from "../model/vehicles.js";

export const createVehicle = async (req, res, next) => {
    try {
        const { role, name, origin, destination, departureTime, arrivalTime, price, meta } = req.body;

        if (!role || !name || !origin || !destination || !departureTime || !arrivalTime || !price || !meta) {
            return res.status(400).json({ message: 'Invalid payload' });
        }

        const departureTimeObject = new Date(departureTime);
        const arrivalTimeObject = new Date(arrivalTime);

        const travelTimeInMs = arrivalTimeObject.getTime() - departureTimeObject.getTime();
        const travelTimeInMinutes = Math.floor(travelTimeInMs / (1000 * 60));


        const vehicle = await vehicleModel.create({
            role,
            name,
            origin,
            destination,
            departureTime,
            arrivalTime,
            travelTime: `${travelTimeInMinutes} minutes`, // Store travel time in minutes
            price,
            meta,
        });

        return res.status(200).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        next(error);
    }
};



// export const createVehicle = async (req, res, next) => {
//     try {
//       const { role, name, origin, destination, departureTime, arrivalTime, price, meta } = req.body;
  
//       if (!role || !name || !origin || !destination || !departureTime || !arrivalTime || !price || !meta) {
//         return res.status(400).json({ message: 'Invalid payload' });
//       }
  
//       const departureTimeObject = new Date(departureTime);
//       const arrivalTimeObject = new Date(arrivalTime);
  
//       const travelTimeInMs = arrivalTimeObject.getTime() - departureTimeObject.getTime();
  
//       const days = Math.floor(travelTimeInMs / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((travelTimeInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((travelTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
  
//       const formattedTravelTime = `${days ? days + 'd ' : ''}${hours ? hours.toString().padStart(2, '0') + 'h ' : ''}${minutes ? minutes.toString().padStart(2, '0') + 'm' : ''}`;
  
//       const vehicle = await vehicleModel.create({
//         role,
//         name,
//         origin,
//         destination,
//         departureTime,
//         arrivalTime,
//         travelTime: formattedTravelTime,
//         price,
//         meta,
//       });
  
//       return res.status(200).json({ message: 'Vehicle created successfully', vehicle:vehicle });
//     } catch (error) {
//       next(error);
//     }
//   };

  
export const getFlightByDestination = async (req, res, next) => {
    try {
        const { destination } = req.query;
        if (!destination) {
            return res.status(400).json({ message: "Destination is required" });
        }
        
        const flight = await vehicleModel.find({ destination: { $regex: `^${destination}$`, $options: 'i' }, role: "FLIGHT" });
        
        return res.status(200).json({ flight: flight});
    } catch (error) {
        next(error);
    }
};

export const getTrainByDestination = async (req, res, next) => {
    try {
        const { destination } = req.query;
        if (!destination) {
            return res.status(400).json({ message: "Destination is required" });
        }
        
        const train = await vehicleModel.find({ destination: { $regex: `^${destination}$`, $options: 'i' }, role: "TRAIN" });
        
        return res.status(200).json({ train: train});
    } catch (error) {
        next(error);
    }
};

export const updateVehicle = async (req, res, next) => {
    try {
        let vehicleId = req.params.id
        await vehicleModel.findByIdAndUpdate(vehicleId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        next(error);
    }
}

export const deleteVehicle = async (req, res, next) => {
    try {
        let vehicleId = req.params.id
        await vehicleModel.findByIdAndDelete(vehicleId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        next(error);
    }
}

export const getVehicle = async (req,res,next) => {
    try{
        let vehicleId = req.params.id
        let vehicle = await vehicleModel.findById(vehicleId)
        return res.status(200).json({vehicle:vehicle})

    }catch(error) {
        next(error);
    }
}