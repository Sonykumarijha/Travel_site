import carModel from "../model/cars.js"

export const createCar = async (req, res) => {
    try {
        const { name, seats, type, tankCapacity, price,review, meta } = req.body
        if (!name || !seats || !type || !tankCapacity || !price || !meta) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let car = await carModel.create({ name, seats, type, tankCapacity, price,review, meta })
        return res.status(200).json({ message: 'car created successfully', car: car })
    } catch (error) {
        return res.status(400).json({ message: 'car not created', error: error })
    }
}


export const updateCar = async (req, res) => {
    try {
        let carId = req.params.id
        await carModel.findByIdAndUpdate(carId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "****error****" })
    }
}

export const deleteCar = async (req, res) => {
    try {
        let carId = req.params.id
        await carModel.findByIdAndDelete(carId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        return res.status(400).json({ message: "not deleted" })
    }
}

export const getCar = async (req,res) => {
    try{
        let carId = req.params.id
        let car = await carModel.findById(carId)
        return res.status(200).json({car:car})

    }catch(error) {
        console.log(error);
        return res.status(400).json({message: "error"})
    }
}

export const getCarsByRating = async (req, res) => {
    try {
        let cars = await carModel.find().sort({ "review.rating": -1 }).limit(10);
        return res.status(200).json({ cars: cars });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "*****Unable to fetch top-rated cars*****" });
    }
};