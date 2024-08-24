import mongoose, { Mongoose } from "mongoose";
import ticketModel from "../model/tickets.js"
import { response } from "express";

export const createTicket = async (req, res, next) => {
    try {
        const { user_id, package_id, subject, description } = req.body;

        if (!user_id || !package_id || !subject) {
            return res.status(400).json({ message: 'Invalid payload: user_id, package_id, and subject are required.' });
        }

        // Validate if user_id and package_id are valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(package_id)) {
            return res.status(400).json({ message: 'Invalid user_id or package_id.' });
        }

        const ticket = await ticketModel.create({ user_id, package_id, subject, description });

        return res.status(200).json({ message: 'Ticket created successfully', ticket });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: 'Validation error', details: error.errors });
        }

        next(error);
    }
};


export const updateTicket = async (req, res, next) => {
    try {
        let ticketId = req.params.id
        if (!ticketId) {
            return res.status(400).json({ message: "id is required" })
        }
        const ticket = await ticketModel.findById(ticketId)
        if (!ticket) {
            return res.status(400).json({ message: " no ticket is present with this id" })
        }

        await ticketModel.findByIdAndUpdate(ticketId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        next(error);
    }
}

export const deleteTicket = async (req, res, next) => {
    try {
        let ticketId = req.params.id
        if (!ticketId) {
            return res.status(200).json({ message: "id is required" })
        }
        const ticket = ticketModel.findById(ticketId)
        if (!ticket) {
            return res.status(400).json({ message: "no ticket is present with this id" })
        }
        await ticketModel.findByIdAndDelete(ticketId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        next(error);
    }
}


export const getTicket = async (req, res, next) => {

    try {
        const ticketId = req.params.id;


        if (!ticketId) {
            return res.status(400).json({ message: "ID is required" });
        }

        const objectId = new mongoose.Types.ObjectId(ticketId);


        const ticket = await ticketModel.aggregate([
            {
                $match: { _id: objectId } // Match ticket by ID
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' // Only include tickets with matching users
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    package_id: 1,
                    subject: 1,
                    description: 1,
                    ticketCreationDate: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    userPhone: '$userDetails.phone'
                }
            }
        ]);


        if (ticket.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const formattedTicket = {
            ticket_id: ticket[0]._id,
            user_id: ticket[0].user_id,
            package_id: ticket[0].package_id,
            subject: ticket[0].subject,
            description: ticket[0].description,
            ticketCreationDate: ticket[0].ticketCreationDate,
            createdAt: ticket[0].createdAt,
            updatedAt: ticket[0].updatedAt,
            userName: ticket[0].userName,
            userEmail: ticket[0].userEmail,
            userPhone: ticket[0].userPhone
        };

        return res.status(200).json({ ticket });

    } catch (error) {
        next(error);
    }
};


export const getAllTicket = async (req, res, next) => {

    try {
        // Aggregate tickets with user details
        const tickets = await ticketModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' // Only include tickets with matching users
            },
            // {
            //     $unwind: {
            //         path: '$userDetails',
            //         preserveNullAndEmptyArrays: true // Optional: Include tickets without matching users
            //     }
            // },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    package_id: 1,
                    subject: 1,
                    description: 1,
                    ticketCreationDate: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    userPhone: '$userDetails.phone'
                }
            }
        ]);



        // Format the response to match the previous format
        const formattedTickets = tickets.map(ticket => ({
            ticket_id: ticket._id,
            user_id: ticket.user_id,
            package_id: ticket.package_id,
            subject: ticket.subject,
            description: ticket.description,
            ticketCreationDate: ticket.ticketCreationDate,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            userName: ticket.userName,
            userEmail: ticket.userEmail,
            userPhone: ticket.userPhone
        }));

        return res.status(200).json({ tickets: formattedTickets });
    } catch (error) {
        next(error);
    }
};

export const getTicketsByAgentId = async (req, res, next) => {
    try {
        const agentId = req.params.id;
        const status = req.query.status; // Assuming status is provided as a query parameter

        if (!agentId) {
            return res.status(400).json({ message: "ID is required" });
        }

        const objectId = new mongoose.Types.ObjectId(agentId);

        // Build match conditions
        const matchConditions = { assignedAgent: objectId };
        if (status) {
            matchConditions.status = status;
        }

        // Aggregate tickets with user details
        const tickets = await ticketModel.aggregate([
            {
                $match: matchConditions // Match ticket by ID and optionally by status
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' // Only include tickets with matching users
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    package_id: 1,
                    subject: 1,
                    description: 1,
                    status: 1,
                    priority: 1,
                    ticketCreationDate: 1,
                    assignedAgent: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    resolutionDetails: 1,
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    userPhone: '$userDetails.phone'
                }
            }
        ]);

        // Format the response to match the previous format
        const formattedTickets = tickets.map(ticket => ({
            ticket_id: ticket._id,
            user_id: ticket.user_id,
            package_id: ticket.package_id,
            subject: ticket.subject,
            description: ticket.description,

            status: ticket.status,
            priority: ticket.priority,

            ticketCreationDate: ticket.ticketCreationDate,
            assignedAgent: ticket.assignedAgent,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            resolutionDetails: ticket.resolutionDetails,
            userName: ticket.userName,
            userEmail: ticket.userEmail,
            userPhone: ticket.userPhone
        }));

        return res.status(200).json({ tickets: formattedTickets });
    } catch (error) {
        next(error);
    }
};


export const getCount = async (req, res, next) => {
    try {
        let tickets = await ticketModel.find();

        let totalTicketCount = tickets.length;
        let createdTicketCount = 0;
        let assignedTicketCount = 0;
        let inProgressTicketCount = 0;

        let resolvedTicketCount = 0;

        tickets.forEach(ticket => {
            switch (ticket.status) {
                case 'CREATED':
                    createdTicketCount++;
                    break;
                case 'ASSIGNED':
                    assignedTicketCount++;
                    break;
                case 'INPROGRESS':
                    inProgressTicketCount++;
                    break;
                case 'RESOLVED':
                    resolvedTicketCount++;
                    break;
                default:
                    break;
            }
        });

        return res.status(200).json({
            totalTicketCount,
            createdTicketCount,
            assignedTicketCount,
            inProgressTicketCount,
            resolvedTicketCount
        });
    } catch (error) {
        next(error);
    }
}


