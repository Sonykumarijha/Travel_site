import tourModel from "../model/tour.js";


export const createTour = async (req, res,next) => {
    try {
        const { title,type, description, destination, price, startDate, endDate } = req.body
        if (!title || !description || !destination || !price || !startDate || !endDate) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let tour = await tourModel.create({ title,type, description, destination, price, startDate, endDate })
        return res.status(200).json({ message: 'tour created successfully', tour: tour })
    } catch (error) {
        next(error);
    }
}

//-------------------- ***** TASK 1 : GET TOUR PACKAGE BY DESTINATION *****---------------------------------------

export const getTourByDestination = async (req, res, next) => {
    try {
        const { destination } = req.query;
        if (!destination) {
            return res.status(400).json({ message: "Destination is required" });
        }
        
        const tour = await tourModel.find({ destination: { $regex: `^${destination}$`, $options: 'i' } });
        
        return res.status(200).json({ tour });
    } catch (error) {
        next(error);
    }
};


//------------------------------------------------------------------------------------------------------------

export const getTour = async (req, res, next) => {
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
        next(error);
    }
};

export const getToursByType = async (req, res, next) => {
    
    try {
        const { type, destination } = req.query;
        
        if (!type) {
            return res.status(400).json({ message: "type is required" });
        }
        
        let query = { type: { $regex: `^${type}$`, $options: 'i' } };
        
        if (destination) {
            query.destination = { $regex: `^${destination}$`, $options: 'i' };
        }

        const tours = await tourModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ tours });
    } catch (error) {
        next(error);
    }
};


export const getHealthAndWellnessTours = async (req, res, next) => {
    try {
        const { destination } = req.query;
        
        let query = { type: { $in: ['health', 'wellness'] } };

        if (destination) {
            query.destination = { $regex: `^${destination}$`, $options: 'i' };
        }

        const tours = await tourModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ tours });
    } catch (error) {
        next(error);
    }
};

export const getFestiveAndCultureTours = async (req, res,next) => {
    try {
        const { destination } = req.query;
        
        let query = { type: { $in: ['festive', 'cultural'] } };

        if (destination) {
            query.destination = { $regex: `^${destination}$`, $options: 'i' };
        }

        const tours = await tourModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ tours });
    } catch (error) {
        next(error);
    }
};

export const updateTour = async (req, res, next) => {
    try {
        let tourId = req.params.id
        await tourModel.findByIdAndUpdate(tourId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        next(error);
    }
}

export const deleteTour = async (req, res,next) => {
    try {
        let tourId = req.params.id
        await tourModel.findByIdAndDelete(tourId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        next(error);
    }
}





