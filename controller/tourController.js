import tourModel from "../model/tour.js";


export const createTour = async (req, res) => {
    try {
        const { title,type, description, destination, price, startDate, endDate } = req.body
        if (!title || !description || !destination || !price || !startDate || !endDate) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let tour = await tourModel.create({ title,type, description, destination, price, startDate, endDate })
        return res.status(200).json({ message: 'tour created successfully', tour: tour })
    } catch (error) {
        return res.status(400).json({ message: 'tour not created', error: error })
    }
}

//-------------------- ***** TASK 1 : GET TOUR PACKAGE BY DESTINATION *****---------------------------------------

export const getTourByDestination = async (req, res) => {
    try {
        const { destination } = req.query;
        if (!destination) {
            return res.status(400).json({ message: "Destination is required" });
        }
        
        const tour = await tourModel.find({ destination: { $regex: `^${destination}$`, $options: 'i' } });
        
        return res.status(200).json({ tour });
    } catch (error) {
        return res.status(400).json({ message: "Unable to fetch tours by destination" });
    }
};


//------------------------------------------------------------------------------------------------------------

export const getTour = async (req, res) => {
    try {
        let tourId = req.params.id 
        if (!tourId) {
            return res.status(400).json({message: "Id is required"})
        }       
        const tour = await tourModel.findById(tourId)
        if (!tour) {
            return res.status(400).json({message: "No tour found with this id"})
        }
        
        return res.status(200).json({ tour });
    } catch (error) {
        return res.status(400).json({ message: "Unable to fetch tours by destination" });
    }
};

export const getToursByType = async (req, res) => {
    console.log('444444444444444444444444444');
    
    try {
        const { type, destination } = req.query;
        
        if (!type) {
            return res.status(400).json({ message: "type is required" });
        }
        
        // Define the query object
        let query = { type: { $regex: `^${type}$`, $options: 'i' } };
        
        // If destination is provided, add it to the query
        if (destination) {
            query.destination = { $regex: `^${destination}$`, $options: 'i' };
        }

        // Fetch activities based on the query
        const tours = await tourModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ tours });
    } catch (error) {
        return res.status(400).json({ message: "Unable to fetch data" });
    }
};


export const getHealthAndWellnessTours = async (req, res) => {
    try {
        const { destination } = req.query;
        
        // Define the base query for type
        let query = { type: { $in: ['health', 'wellness'] } };

        // If destination is provided, add it to the query
        if (destination) {
            query.destination = { $regex: `^${destination}$`, $options: 'i' };
        }

        // Fetch tours based on the constructed query
        const tours = await tourModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ tours });
    } catch (error) {
        return res.status(400).json({ message: "Unable to fetch data" });
    }
};

export const getFestiveAndCultureTours = async (req, res) => {
    try {
        const { destination } = req.query;
        
        // Define the base query for type
        let query = { type: { $in: ['festive', 'cultural'] } };

        // If destination is provided, add it to the query
        if (destination) {
            query.destination = { $regex: `^${destination}$`, $options: 'i' };
        }

        // Fetch tours based on the constructed query
        const tours = await tourModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ tours });
    } catch (error) {
        return res.status(400).json({ message: "Unable to fetch data" });
    }
};

export const updateTour = async (req, res) => {
    try {
        let tourId = req.params.id
        await tourModel.findByIdAndUpdate(tourId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "****error****" })
    }
}

export const deleteTour = async (req, res) => {
    try {
        let tourId = req.params.id
        await tourModel.findByIdAndDelete(tourId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        return res.status(400).json({ message: "not deleted" })
    }
}





