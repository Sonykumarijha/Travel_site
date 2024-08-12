import cloudinary from "../helpers/cloudinary.js"
import packageModel from "../model/packages.js"

export const createPackage = async (req, res,next) => {
    try {
        const { title, package_type, description, duration, destination, origin, price, day_plan, review, meta } = req.body
        const image = req.file ? req.file.path : null
        if (!title || !description || !duration || !destination || !origin || !price || !day_plan) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let holidayPackage = await packageModel.create({ title, package_type, description, duration: `${duration} days`, destination, origin, price, day_plan, review, meta, image })

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image);

        let Package =  await packageModel.findByIdAndUpdate(holidayPackage._id, {image: result.secure_url}, {new: true})
        


        return res.status(200).json({ message: 'package created successfully', package: Package, imageUrl: result.secure_url })
    } catch (error) {

        next(error);
    }
}

export const getPackage = async (req, res,next) => {
    try {
        let packageId = req.params.id
        if (!packageId) {
            return res.status(400).json({ message: " package Id is required" })
        }
        let holidayPackage = await packageModel.findById(packageId)
        if (!holidayPackage) {
            return res.status(400).json({ message: "Package is not exist with this id" })
        }

        return res.status(200).json({ package: holidayPackage })
    } catch (error) {
        next(error);
    }
}

export const getPackagesByType = async (req, res,next) => {
    try {
        const { packagetype } = req.query

        let PackagesByType = await packageModel.find({ package_type: { $regex: new RegExp(`^${packagetype}$`, 'i') } })
        return res.status(200).json({ [`${packagetype} packages`]: PackagesByType })
    } catch (error) {
        next(error);
    }
} 

export const getPackagesByDestination = async (req, res, next) => {
    try {
        const { destination } = req.query

        let PackagesByDestination = await packageModel.find({
            destination: { $regex: new RegExp(`^${destination}$`, 'i') }
        });
        return res.status(200).json({ packages: PackagesByDestination })
    } catch (error) {
        next(error);
    }
}

export const updatedPackage = async (req, res, next) => {
    try {
        let packageId = req.params.id

        if (!packageId) {
            return res.status(400).json({ message: " package Id is required" })
        }

        let holidayPackage = await packageModel.findById(packageId)
        if (!holidayPackage) {
            return res.status(400).json({ message: " no package exist with this id" })
        }

        let updatedPackage = await packageModel.findByIdAndUpdate(packageId, req.body, { true: true })

        return res.status(400).json({ message: "updated successfully" })


    } catch (error) {
        next(error);

    }
}

export const deletePackage = async (req, res, next) => {
    try {
        let packageId = req.params.id
        if (!packageId) {
            return res.status(400).json({ message: "package id is required" })
        }
        await packageModel.findByIdAndDelete(packageId)
        return res.status(400).json({ message: " deleted successfully" })
    } catch (error) {
        next(error);
    }
}

//{"title": "Amazing Goa Tour", "description": "Experience the best of Goa in 3 days","duration": "3 ","destination": "Goa","origin": "Delhi","price": 50000,"day_plan": {"a":"a","b": "a"},"meta": "meta data"}