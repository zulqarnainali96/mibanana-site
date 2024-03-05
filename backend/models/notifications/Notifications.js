const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    project_id: {
        type: String,
        required: false
    },
    project_title: {
        type: String,
        required: false
    },
    msg: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false
    },
}, {
    timestamps: true
})
export const notifications = mongoose.model('notifications', notificationSchema)