import tourModel from "../model/tour.js";


export const createTour = async (req, res) => {
    try {
        const { title, description, destination, price, startDate, endDate } = req.body
        if (!title || !description || !destination || !price || !startDate || !endDate) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let tour = await tourModel.create({ title, description, destination, price, startDate, endDate })
        return res.status(200).json({ message: 'tour created successfully', tour: tour })
    } catch (error) {
        return res.status(400).json({ message: 'tour not created', error: error })
    }
}

//--------------------***** TASK 1 : GET TOUR PACKAGE BY DESTINATION *****---------------------------------------

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





