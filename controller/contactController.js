import contactModel from "../model/contacts.js"

export const createContact = async (req, res,next) => {
    try {
        const { name, email, meta } = req.body
        if (!name || !email ) {
            const error = new Error('Invalid payload');
            error.status = 400;
            return next(error);

            // return res.status(400).json({ message: 'invalid payload' })
        }
        let contact = await contactModel.create({ name, email, meta })
        return res.status(200).json({ message: 'contact created successfully', contact: contact })
    } catch (error) {
        next(error);
    }
}


export const getContact = async (req,res,next) => {
    try {
        let contactId = req.params.id
        if (!contactId) {
            return res.status(400).json({message: "contact Id is required"})
        }
        let contact = await contactModel.findById(contactId)
        if (!contact) {
            return res.status(400).json({message: " no contact found with this id"})
        }
        return res.status(200).json({contact})
    } catch (error) {
        next(error);
    }
}

export const updateContact = async (req,res,next) => {
    try {
        let contactId = req.params.id
        if (!contactId) {
            return res.status(400).json({message: " contact id is required"})
        }
        let contact = await contactModel.findById(contactId)

        if (!contact) {
            return res.status(400).json({message: "no contact found with this id"})
        }

        let updatedContact = await contactModel.findByIdAndUpdate(contactId, req.body, {new: true})

        return res.status(200).json({message: " updated successfully", updated_contact: updatedContact})
    } catch (error) {
        next(error);
    }
}

export const deleteContact = async (req,res, next) => {
    try {
        let contactId = req.params.id
        if (!contactId) {
            return res.status(400).json({message: "contact id is required"})
        }
        let contact = await contactModel.findById(contactId)
        if (!contact) {
            return res.status(400).json({messag: " no contact found with this id"})
        }

        await contactModel.findByIdAndDelete(contactId)

        return res.status(200).json({message: " contact deleted successfully"})
        
    } catch (error) {
        next(error);
    }
}