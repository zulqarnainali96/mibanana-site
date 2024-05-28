const mongoose = require("mongoose")

const WebAppSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        default: ""
    },
    project_title: {
        type: String,
        required: true,
        default: ""
    },
    preferred_stack: {
        type: String,
        required: true,
        default: ""
    },
    backend_tech: {
        type: String,
        required: true,
        default: ""
    },
    project_description: {
        type: String,
        required: false,
        default: ""
    },
    is_active: {
        type: Boolean,
        default: false,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Project manager'
    },
    project_category : {
        type: String,
        required: false,
        default: 'web-app'
    },
    version: [{
        type: String,
        required: false,
        default: ["1"]
    }],
    drive_link: {
        type: String,
        required: false,
        default: ""
    },
    figma_link: {
        type: String,
        required: false,
        default: ""
    },
    team_members: [{
        type: Object,
        required: false,
        default: []
    }],
    files: [{
        type: Object,
        required: false,
        default: []
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('webapp_Projects', WebAppSchema)