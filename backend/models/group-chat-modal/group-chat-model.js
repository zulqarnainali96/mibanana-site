const mongoose = require('mongoose')

const groupChatSchema = mongoose.Schema({
    group_name: {
        type: String,
        required: true,
        default: ""
    },
    group_admin: {
        type: String,
        required: true,
        default: ""
    },
    group_description: {
        type: String,
        required: false,
        default: ""
    },
    participant: [{
        type: Object,
        required: true,
        default: []
    }],
    messages: [{
        type: Object,
        required: true,
        default: [],
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('group_chat', groupChatSchema)