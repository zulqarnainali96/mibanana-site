const mongoose = require("mongoose")

const websiteSchema = mongoose.Schema({
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
    project_category: {
        type: String,
        required: true,
        default: ""
    },
    brand: {
        type: Object,
        required: false,
        default: {}
    },
    role: {
        type: String,
        required: false,
        default: ''
    },
    website_type: {
        type: String,
        required: true,
        default: ""
    },
    preferred_stack: {
        type: String,
        required: true,
        default: ""
    },
    project_description: {
        type: String,
        required: true,
        default: ""
    },
    is_active: {
        type: Boolean,
        default: false,
        required: true
    },
    project_category : {
        type: String,
        required: false,
        default: 'website-development'
    },
    status: {
        type: String,
        required: true,
        default: 'Project manager'
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
    timestamps : true
})

module.exports = mongoose.model('Website_Projects', websiteSchema)