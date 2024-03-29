const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        required: true,
        default: ["Customer"]
    }],
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    phone_no: {
        type: String,
        required: false
    },
    company_profile: {
        type: String,
        required: false
    },
    notifications: [{
        type: Object,
        required: false,

    }],
    avatar: {
        type: String,
        required: false
    },
    project_notifications: [{
        type: Object,
        required: false,
        default: []
    }],
    status_notifications: [{
        type: Object,
        required: false,
        default: []
    }],
    created_at: {
        type: String,
        required: false
    }
})
const User = mongoose.model('User', UserSchema)
module.exports = User