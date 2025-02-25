const { saveContact } = require('../models/contactModel');

const addContact = async (req, res) => {
    try {
        const { username, email, message } = req.body;

        if (!username || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newContact = await saveContact(username, email, message);
        res.status(201).json({ message: "Contact saved successfully", data: newContact });
    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { addContact };
