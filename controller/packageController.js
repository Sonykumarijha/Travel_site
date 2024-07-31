import packageModel from "../model/packages.js"

export const createPackage = async (req, res) => {
    try {
        const { title, description,duration, destination,origin, price, day_plan, review, meta } = req.body
        if (!title || !description || !duration || !destination || !origin || !price || !day_plan ) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let holidayPackage = await packageModel.create({ title, description,duration :`${duration} days`, destination,origin, price, day_plan, review, meta })
        return res.status(200).json({ message: 'package created successfully', package: holidayPackage })
    } catch (error) {
        return res.status(400).json({ message: 'package not created', error: error })
    }
}

export const getPackage = async (req,res) => {
    try {
        let packageId = req.params.id
        if (!packageId) {
            return res.status(400).json({message: " package Id is required"})
        }
        let holidayPackage = await packageModel.findById(packageId)
        if (!holidayPackage) {
            return res.status(400).json({message: "Package is not exist with this id"})
        }

        return res.status(200).json({package:holidayPackage})
    } catch (error) {
        return res.status(400).json({message: "something went wrong"})
    }
}

export const updatedPackage = async(req,res) => {
    try {
        let packageId = req.params.id

        if (!packageId) {
            return res.status(400).json({message: " package Id is required"})
        }

        let holidayPackage = await packageModel.findById(packageId)
        if (!holidayPackage) {
            return res.status(400).json({message: " no package exist with this id"})
        }

        let updatedPackage = await packageModel.findByIdAndUpdate(packageId,req.body,{true: true})

        return res.status(400).json({message: "updated successfully"})
        

    } catch (error) {
        return res.status(400).json({message: "something went wrong"})

    }
}

export const deletePackage = async(req,res) => {
    try {
        let packageId = req.params.id 
        if (!packageId) {
            return res.status(400).json({message: "package id is required"})
        }
        await packageModel.findByIdAndDelete(packageId)
        return res.status(400).json({message: " deleted successfully"})
    } catch (error) {
        return res.status(400).json({message: "something went wrong"})
    }
}