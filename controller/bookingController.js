import bookingModel from "../model/bookings.js"
import packageModel from "../model/packages.js"

export const createBooking = async(req,res,next) => {
    try {
        const {user_id,package_id,tripStartDate,tripEndDate,numberOfGuests,paymentStatus,bookingStatus,meta} = req.body
        const Package = await packageModel.findById(package_id)
        const totalPrice = Package.price
        
        if (!user_id || !package_id || !tripStartDate || !tripEndDate || !numberOfGuests) {
            return res.status(400).json({messagee: "invalid payload"})
        }
        const booking = await bookingModel.create({user_id,package_id,tripStartDate,tripEndDate,numberOfGuests,totalPrice,paymentStatus,bookingStatus,meta})
        return res.status(200).json({message: " Booking done", booking})
    } catch (error) {
        next(error)
    }
}

export const getBooking = async (req,res,next) => {
    try {
        let bookingId = req.params.id
        if (!bookingId) {
            return res.status(400).json({message: "booking Id is required"})
        }
        let booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return res.status(400).json({message: " no booking found with this id"})
        }
        return res.status(200).json({booking})
    } catch (error) {
        next(error);
    }
}

export const getAllBooking = async (req,res,next) => {
    try {
        let AllBooking = await bookingModel.find()
        return res.status(200).json({AllBooking})
    } catch (error) {
        next(error);
    }
}

export const cancelBooking = async (req, res,next) => {
    try {
        let bookingId = req.params.id
        if (!bookingId) {
            return res.status(400).json({message: "booking id is required"})
        }
        await bookingModel.findByIdAndUpdate(bookingId, {bookingStatus:"CANCELLED"}, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        next(error);
    }
}

export const deleteBooking = async (req,res, next) => {
    try {
        let bookingId = req.params.id
        if (!bookingId) {
            return res.status(400).json({message: "booking id is required"})
        }
        let booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return res.status(400).json({messag: " no booking found with this id"})
        }

        await bookingModel.findByIdAndDelete(bookingId)

        return res.status(200).json({message: " booking deleted successfully"})
        
    } catch (error) {
        next(error);
    }
}