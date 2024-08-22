const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chated_persons: [{
        user_id: {
            type: String,
            required: true,
            default: '',
        },
        unread_messages_count: {
            type: String,
            required: false,
            default: '',
        },
        unread_messages_ids : [{
            type: String,
            required: false,
            default: '',
        }]
    }]
}, {
    timestamps: true,
})

module.exports = mongoose.model('ChatHistory', chatHistorySchema);