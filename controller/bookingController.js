import mongoose from "mongoose"
import bookingModel from "../model/bookings.js"
import packageModel from "../model/packages.js"

export const createBooking = async (req, res, next) => {
    try {
        const { user_id, package_id, first_name, last_name, phone, email, address, tripStartDate, numberOfGuests, paymentStatus, bookingStatus, meta } = req.body;
        
        // Find the package by ID
        const Package = await packageModel.findById(package_id);
        console.log(Package, '___Package**');

        let packageDuration = Number(Package.duration);
        console.log(packageDuration, '___packageDuration**');
        
        // Convert tripStartDate from string to Date object
        const tripStartDateObj = new Date(tripStartDate);
        
        // Add package duration days to the start date
        const tripEndDate = new Date(tripStartDateObj.getTime() + packageDuration * 24 * 60 * 60 * 1000);
        console.log(tripEndDate, '____tripEndDate**');
        
        // Check for required fields
        if (!user_id || !package_id || !first_name || !last_name || !phone || !email || !tripStartDate) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        // Validate MongoDB Object IDs
        if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(package_id)) {
            return res.status(400).json({ message: 'Invalid user_id or package_id.' });
        }

        // Calculate total price (you can adjust this logic as needed)
        const totalPrice = Package.price;
        
        // Create the booking
        const booking = await bookingModel.create({ 
            user_id, 
            package_id, 
            first_name, 
            last_name, 
            phone, 
            email, 
            address, 
            tripStartDate: tripStartDateObj, 
            tripEndDate,  // Add tripEndDate to the booking 
            numberOfGuests, 
            totalPrice, 
            paymentStatus, 
            bookingStatus, 
            meta 
        });

        return res.status(200).json({ message: "Booking done", booking });
    } catch (error) {
        next(error);
    }
};


// export const createBooking = async (req, res, next) => {
//     try {
//         const { user_id, package_id, tripStartDate, tripEndDate, numberOfGuests, paymentStatus, bookingStatus, meta } = req.body
//         const Package = await packageModel.findById(package_id)
//         const totalPrice = Package.price

//         if (!user_id || !package_id || !tripStartDate || !tripEndDate || !numberOfGuests) {
//             return res.status(400).json({ messagee: "invalid payload" })
//         }

//         if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(package_id)) {
//             return res.status(400).json({ message: 'Invalid user_id or package_id.' });
//         }

//         const booking = await bookingModel.create({ user_id, package_id, tripStartDate, tripEndDate, numberOfGuests, totalPrice, paymentStatus, bookingStatus, meta })
//         return res.status(200).json({ message: " Booking done", booking })
//     } catch (error) {
//         next(error)
//     }
// }

export const getBooking = async (req, res, next) => {
    try {
        let bookingId = req.params.id
        if (!bookingId) {
            return res.status(400).json({ message: "booking Id is required" })
        }
        let booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return res.status(400).json({ message: " no booking found with this id" })
        }
        return res.status(200).json({ booking })
    } catch (error) {
        next(error);
    }
}

export const getAllBooking = async (req, res, next) => {
    try {
        const bookings = await bookingModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'

            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'package_id',
                    foreignField: '_id',
                    as: 'packageDetails'
                }
            },
            {
                $unwind: '$packageDetails'

            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    package_id: 1,
                    tripStartDate: 1,
                    tripEndDate: 1,
                    numberOfGuests: 1,
                    totalPrice: 1,
                    paymentStatus: 1,
                    bookingStatus: 1,
                    meta: 1,
                    bookingDate: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    userPhone: '$userDetails.phone',
                    title: '$packageDetails.title',
                    packageType: '$packageDetails.package_type'
                }
            }
        ])

        console.log(bookings, '___bookings**');

        const formattedBookings = bookings.map(booking => ({
            user_id: booking.user_id,
            userName: booking.userName,
            userEmail: booking.userEmail,
            userPhone: booking.userPhone,

            package_id: booking.package_id,
            packageTitle: booking.title,
            packageType: booking.packageType,

            bookings_id: booking._id,
            tripStartDate: booking.tripStartDate,
            tripEndDate: booking.tripEndDate,
            numberOfGuests: booking.numberOfGuests,
            totalPrice: booking.totalPrice,
            paymentStatus: booking.paymentStatus,
            bookingStatus: booking.bookingStatus,
            meta: booking.meta,
            bookingDate: booking.bookingDate,
            // createdAt: booking.createdAt,
            // updatedAt: booking.updatedAt,


        }));

        return res.status(200).json({ bookings: formattedBookings });


    } catch (error) {
        next(error);
    }
}


export const cancelBooking = async (req, res, next) => {
    try {
        let bookingId = req.params.id
        if (!bookingId) {
            return res.status(400).json({ message: "booking id is required" })
        }
        await bookingModel.findByIdAndUpdate(bookingId, { bookingStatus: "CANCELLED" }, {
            new: true
        })

        return res.status(200).json({ message: "CANCELLED successfully" })

    } catch (error) {
        next(error);
    }
}

export const deleteBooking = async (req, res, next) => {
    try {
        let bookingId = req.params.id
        if (!bookingId) {
            return res.status(400).json({ message: "booking id is required" })
        }
        let booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return res.status(400).json({ messag: " no booking found with this id" })
        }

        await bookingModel.findByIdAndDelete(bookingId)

        return res.status(200).json({ message: " booking deleted successfully" })

    } catch (error) {
        next(error);
    }
}


export const getCount = async (req, res, next) => {
    try {
        let bookings = await bookingModel.find();

        let totalBookingCount = bookings.length;
        let pendingBookingCount = 0;
        let cancelledBookingCount = 0;
        let confirmedBookingCount = 0;
        let finishedBookingCount = 0;


        bookings.forEach(booking => {
            switch (booking.bookingStatus) {
                case 'PENDING':
                    pendingBookingCount++;
                    break;
                case 'CONFIRMED':
                    confirmedBookingCount++;
                    break;
                case 'CANCELLED':
                    cancelledBookingCount++;
                    break;
                case 'FINISHED':
                    finishedBookingCount++;
                    break;
                default:
                    break;
            }
        });

        return res.status(200).json({
            totalBookingCount,
            pendingBookingCount,
            cancelledBookingCount,
            confirmedBookingCount,
            finishedBookingCount
        });
    } catch (error) {
        next(error);
    }
}
