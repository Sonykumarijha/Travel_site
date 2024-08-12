import carModel from "../model/cars.js"

export const createCar = async (req, res,next) => {
    try {
        const { name, seats, type, tankCapacity, price,review, meta } = req.body
        if (!name || !seats || !type || !tankCapacity || !price || !meta) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let car = await carModel.create({ name, seats, type, tankCapacity, price,review, meta })
        return res.status(200).json({ message: 'car created successfully', car: car })
    } catch (error) {
        next(error);
    }
}


export const updateCar = async (req, res,next) => {
    try {
        let carId = req.params.id
        await carModel.findByIdAndUpdate(carId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        next(error);
    }
}

export const deleteCar = async (req, res,next) => {
    try {
        let carId = req.params.id
        await carModel.findByIdAndDelete(carId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        next(error);
    }
}

export const getCar = async (req,res,next) => {
    try{
        let carId = req.params.id
        let car = await carModel.findById(carId)
        return res.status(200).json({car:car})

    }catch(error) {
        next(error);
    }
}

export const getCarsByRating = async (req, res,next) => {
    try {
        let cars = await carModel.find().sort({ "review.rating": -1 }).limit(10);
        return res.status(200).json({ cars: cars });
    } catch (error) {
        next(error);
    }
};