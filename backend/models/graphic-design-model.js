const mongoose = require("mongoose")

const projectModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name : {
        type : String,
        required : true,
    },
    project_category: {
        type: String,
        required: true
    },
    design_type: {
        type: String,
        required: true
    },
    brand: {
        type: Object,
        required: true,
        default : {}
    },
    project_title: {
        type: String,
        required: true
    },
    project_description: {
        type: String,
        required: true
    },
    describe_audience: {
        type: String,
        required: false
    },
    sizes: {
        type: String,
        required: true
    },
    resources: {                    // Content of Project
        type: String,
        required: false
    },
    reference_example: [{
        type: String,
        required: false
    }],
    add_files: [{
        type: Object,
        required: false,
        default : [],
    }],
    specific_software_names: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        default: false,
        required: true
    },
    file_formats : [{
        type : String,
        required : false,
    }],
    status : {
        type : String,
        required : true,
        default : 'Project manager'
    },
    // Required in Future when project manager update the data it will need a need to add Array of Team members that are working on this project
    team_members: [{
        type: Object,
        required: false
    }],
    version : [{
        type : String,
        required : false,
        default : ["1"]
    }],
    drive_link : {
        type : String,
        required : false,
        default : ""
    },
    figma_link : {
        type : String,
        required : false,
        default : ""
    },
    status: {
        type: String,
        required: false
    }
    ////// END
},
    {
        timestamps: true
    }
)

module.exports = Graphicproject = mongoose.model('graphicDesign', projectModel)




