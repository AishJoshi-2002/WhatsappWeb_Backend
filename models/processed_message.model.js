const mongoose = require('mongoose');

const processedMessageSchema = new mongoose.Schema({
    message_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    timestamp: {
        type: Date,
        required: true
    },
    current_status: {
        type: String,
        enum: ['sent', 'delivered', 'read', 'unknown'],
        default: 'unknown'
    },
    status: {
        sent: { timestamp: Date },
        delivered: { timestamp: Date },
        read: { timestamp: Date }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const processedMessageModel = mongoose.model('processed_message', processedMessageSchema);

module.exports = processedMessageModel;