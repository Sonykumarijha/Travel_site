import cloudinary from "../helpers/cloudinary.js";
import activityModel from "../model/activities.js"
import path from 'path';
import fs from 'fs';



export const createActivity = async (req, res,next) => {
    console.log('____inside createActivity');
    
    try {
        const { title,name, location, price, review,activity_type,description,meta} = req.body
        const image = req.file ? req.file.path : null;

        if (!name || !location || !price) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let activity = await activityModel.create({title,name,image, location, price, review, activity_type,description,meta })
        if (image) {
            const result = await cloudinary.uploader.upload(image);
            activity = await activityModel.findByIdAndUpdate(activity._id, {image_url:result.secure_url}, {new:true})
        }

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

export const getActivitiesByType = async (req, res, next) => {
    try {
        const { activity_type } = req.query;
        
        if (!activity_type) {
            return res.status(400).json({ message: "activity_type is required" });
        }
        
        // Define the query object
        let query = { activity_type: { $regex: `^${activity_type}$`, $options: 'i' } };
        
      
        // Fetch activities based on the query
        const activities = await activityModel.find(query).sort({ "review.rating": -1 });
        
        return res.status(200).json({ activities });
    } catch (error) {
        next(error);
    }
};

export const updateActivity = async (req, res, next) => {
    try {
        const activityId = req.params.id;
        if (!activityId) {
            return res.status(400).json({ message: "activity ID is required" });
        }

        const activity = await activityModel.findById(activityId);

        if (!activity) {
            return res.status(404).json({ message: "activity not found" });
        }

        const { title, name, location,price,activity_type,description,image } = req.body;
        let newImage = activity.image;  // Default to existing image
        let imageUrl = activity.image_url;  // Default to existing image URL

        // Check if a new image file is provided
        if (req.file) {
            newImage = req.file.path;

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload(newImage);
            imageUrl = result.secure_url;

            // Delete the old image file if a new one is provided
            if (newImage && activity.image) {
                const oldImagePath = path.join('uploads/', '..', activity.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete old image:', err);
                    }
                });
            }
        }

        const data = {
            title: title || activity.title,
            name: name || activity.name,
            location: location || activity.location,
            price: price || activity.price,
            activity_type: activity_type || activity.activity_type,
            description: description || activity.description,
            image: newImage,
            image_url: imageUrl
        };

        const updatedActivity = await activityModel.findByIdAndUpdate(activityId, data, { new: true });

        return res.status(200).json({ message: "Updated successfully", updatedActivity: updatedActivity });
    } catch (error) {
        next(error);
    }
};

// export const getActivityByType = async (req,res,next) => {
//     try {
//         const 
//     } catch (error) {
//         next(error)
//     }
// }


export const deleteActivity = async (req, res,next) => {
    try {
        let activityId = req.params.id
        await activityModel.findByIdAndDelete(activityId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        next(error);
    }
}
