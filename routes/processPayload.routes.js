const express = require('express');
const router = express.Router();
const { sendMessage, getMessage } = require('../controllers/processPayload.controller');
const { authUser } = require('../middleware/auth.middleware');

router.post('/send', authUser, sendMessage);

router.get('/chat', authUser, getMessage);

module.exports = router;