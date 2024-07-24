import activityModel from "../model/activities"

export const createActivity = async (req, res) => {
    try {
        const { name, location, price} = req.body
        if (!name || !location || !price) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let activity = await activityModel.create({name, location, price })
        return res.status(200).json({ message: 'activity created successfully', activity: activity })
    } catch (error) {
        return res.status(400).json({ message: 'activity not created', error: error })
    }
}

export const getActivityByLocation = async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({ message: "location is required" });
        }
        
        const activities = await activityModel.find({ location: { $regex: `^${location}$`, $options: 'i' } });
        
        return res.status(200).json({ activities });
    } catch (error) {
        return res.status(400).json({ message: "Unable to fetch activity by location" });
    }
};




export const updateActivity = async (req, res) => {
    try {
        let activityId = req.params.id
        await activityModel.findByIdAndUpdate(activityId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "****error****" })
    }
}

export const deleteActivity = async (req, res) => {
    try {
        let activityId = req.params.id
        await tourModel.findByIdAndDelete(activityId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        return res.status(400).json({ message: "not deleted" })
    }
}
