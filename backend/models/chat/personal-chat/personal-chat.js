const mongoose = require('mongoose');

const PersonalChatSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    chats : [{
        type : Object,
        default : [],
        required : true
    }]
}, { timestamps: true });

module.exports = mongoose.model('PersonalChat', PersonalChatSchema);