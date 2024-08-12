import activityModel from "../model/activities.js"

export const createActivity = async (req, res,next) => {
    try {
        const { title,name, location, price, review,activity_type,description,meta} = req.body
        if (!name || !location || !price) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let activity = await activityModel.create({title,name, location, price, review, activity_type,description,meta })
        return res.status(200).json({ message: 'activity created successfully', activity: activity })
    } catch (error) {
        next(error);
    }
}

export const getActivityByLocation = async (req, res,next) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({ message: "location is required" });
        }
        
        const activities = await activityModel.find({ location: { $regex: `^${location}$`, $options: 'i' } }).sort({ "review.rating": -1 }).limit(5);
        
        return res.status(200).json({ activities });
    } catch (error) {
        next(error);
    }
};

export const getActivitiesByName = async (req, res, next) => {
    try {
        const { name, location } = req.query;
        
        if (!name) {
            return res.status(400).json({ message: "name is required" });
        }
        
        // Define the query object
        let query = { name: { $regex: `^${name}$`, $options: 'i' } };
        
        // If destination is provided, add it to the query
        if (location) {
            query.location = { $regex: `^${location}$`, $options: 'i' };
        }

        // Fetch activities based on the query
        const activities = await activityModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ activities });
    } catch (error) {
        next(error);
    }
};




export const updateActivity = async (req, res,next) => {
    try {
        let activityId = req.params.id
        await activityModel.findByIdAndUpdate(activityId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const deleteActivity = async (req, res,next) => {
    try {
        let activityId = req.params.id
        await activityModel.findByIdAndDelete(activityId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        next(error);
    }
}
