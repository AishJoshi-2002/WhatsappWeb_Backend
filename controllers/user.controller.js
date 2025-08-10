const userModel = require('../models/user.model')
const { createUser, addContact } = require('../utils/sharedProcessPayload');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

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

const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { number } = req.body;
    const user = await userModel.findOne({ number });
    if (!user) {
        return res.status(401).json({ message: 'This number is not registered.' });
    }
    const token = user.generateAuthToken();
    res.status(200).json({ token, user });
}

const getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

const addContact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userNumber, contactInfo } = req.body;
        const user = await addContact({
            userNumber,
            contactInfo
        });
        await user.save();
        res.status(201).json({ message: "Contact added successfully", contacts: user.contacts });
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = { registerUser, loginUser, getUserProfile, addContact, logoutUser };