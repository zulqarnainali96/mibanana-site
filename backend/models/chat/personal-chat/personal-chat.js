const mongoose = require('mongoose');

const PersonalChatSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    chats: [{
        type: Object,
        default: [],
        required: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('PersonalChat', PersonalChatSchema);

// user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
// },
// chats: [{
//     receiver: { type: String, required: true },
//     message: [{
//         id: { type: String, required: true },
//         message: { type: String, required: true },
//         receiver: { type: String, required: true },
//         sender: { type: String, required: true },
//         sender_name: { type: String, required: true },
//         type: { type: String, default: 'personal-chat' },
//         date: { type: Date, required: true },
//         avatar: { type: Boolean, required: false, default: false },
//         view: { type: Boolean, default: false },
//     }]
// }]