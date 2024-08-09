import contactModel from "../model/contacts.js"

export const createContact = async (req, res) => {
    try {
        const { name, email, meta } = req.body
        if (!name || !email ) {
            return res.status(400).json({ message: 'invalid payload' })
        }
        let contact = await contactModel.create({ name, email, meta })
        return res.status(200).json({ message: 'contact created successfully', contact: contact })
    } catch (error) {
        console.log(error,'__error');
        
        return res.status(400).json({ message: 'contact not created', error: error })
    }
}
