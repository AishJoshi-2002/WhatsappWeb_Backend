const processedMessageModel = require('../models/processed_message.model');
const { createUser, addContact } = require('../utils/sharedProcessPayload');
const { validationResult } = require('express-validator');

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, number, accountType, contacts } = req.body;
    const isUserAlreadyExist = await userModel.findOne({ number });
    if (isUserAlreadyExist) {
        return res.status(400).json({ message: 'This number is already registered.' });
    }
    const user = await createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        number,
        accountType,
        contacts
    });
    const token = user.generateAuthToken();
    res.status(201).json({ token, user });
};

module.exports = { sendMessage, getMessage };