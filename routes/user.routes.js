const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser, getUserProfile, logoutUser, addContact } = require('../controllers/user.controller');
const { authUser } = require('../middleware/auth.middleware');

router.post('/register', [
    body('number').isMobilePhone('en-IN').withMessage('Invalid Indian phone number'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
], registerUser);

router.post('/login', [
    body('number').isMobilePhone('en-IN').withMessage('Invalid Indian phone number')
], loginUser);

router.get('/profile', authUser, getUserProfile);

router.put('/addContact', body('number').isMobilePhone('en-IN').withMessage('Invalid Indian phone number'), addContact);

router.get('/logout', authUser, logoutUser);

module.exports = router;