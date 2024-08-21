import ticketModel from "../model/tickets.js"

export const createTicket = async (req, res,next) => {
    try {
        const { user_id, package_id, subject, Description} = req.body
        if (!user_id || !package_id || !subject || !Description) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let ticket = await ticketModel.create({user_id, package_id, subject, Description })
        return res.status(200).json({ message: 'ticket created successfully', ticket })
    } catch (error) {
        next(error);
    }
}


export const updateTicket = async (req, res,next) => {
    try {
        let ticketId = req.params.id
        await ticketModel.findByIdAndUpdate(ticketId, req.body, {
            new: true
        })

        return res.status(200).json({ message: "updated successfully" })

    } catch (error) {
        next(error);
    }
}

export const deleteTicket = async (req, res,next) => {
    try {
        let ticketId = req.params.id
        await ticketModel.findByIdAndDelete(ticketId)
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        next(error);
    }
}

export const getTicket = async (req,res,next) => {
    try{
        let ticketId = req.params.id
        let ticket = await ticketModel.findById(ticketId)
        return res.status(200).json({ticket})

    }catch(error) {
        next(error);
    }
}

export const getAllTicket = async (req, res,next) => {
    try {
        let tickets = await ticketModel.find()
        return res.status(200).json({ tickets });
    } catch (error) {
        next(error);
    }
};