const mongoose = require('mongoose')


const SocialMediaSchema = mongoose.Schema({
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
    service_type: {
        type: String,
        required: true,
        default: ""
    },
    platforms: {
        type: String,
        required: true,
        default: ""
    },
    plan: {
        type: String,
        required: true,
        default: ""
    },
    project_description: {
        type: String,
        required: false,
        default: ""
    },
    project_category : {
        type: String,
        required: false,
        default: 'social-media-manager'
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

module.exports =  mongoose.model('SocialMedia_Projects', SocialMediaSchema)
