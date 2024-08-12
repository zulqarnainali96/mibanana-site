const asyncHandler = require("express-async-handler")
const User = require('../../../models/UsersLogin')
const graphicDesignModel = require("../../../models/graphic-design-model")
const { bucket } = require('../../../google-cloud-storage/gCloudStorage')
const { sendStatusChangeMailtoCustomer } = require("../../../utils/sendMail")
const mobileAppModel = require('../../../models/projects/mobile-dev/mobile-dev-model')
const webappModel = require('../../../models/projects/web-app/web-app-model')
const copyWritingModel = require('../../../models/projects/copy-writing/copy-writing-model')
const socialMediaModal = require('../../../models/projects/social-media-modal/social-media-modal')
const websiteModal = require('../../../models/projects/website-model/website-model')
const webAppModel = require("../../../models/projects/web-app/web-app-model")
const { findRole } = require("../../../utils/helper")

const createGraphicDesign = asyncHandler(async (req, res) => {
    const {
        id, // requried User ID
        name,
        project_category,  // requried
        design_type, brand, // requried 
        project_title, // requried
        project_description, // requried
        sizes, // requried
        is_active,
        specific_software_names,
        file_formats,
        // add_files,
        // describe_audience, // requried
        // reference_example,
        // resources,
    } = req.body

    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (id) {
        const findUser = await User.findOne({ _id: id }).select('-password').lean().exec()
        if (!findUser) {
            throw new Error("User not found ")
            // return res.status(404).json({ message: 'User not found' })
        }
        if (findUser) {
            const obj = {
                user: id, // ID of Customer
                name,  // Name of person who creating project // Customer
                file_formats,
                project_category,
                design_type,
                brand,
                project_title,
                project_description,
                sizes,
                specific_software_names,
                is_active,
                version: ["1"],
                drive_link: "",
                status: 'Project manager',
            }
            const creating_data = await graphicDesignModel.create(obj)
            if (!creating_data) {
                throw new Error("Unable to create data")
            }
            return res.status(201).json({ message: 'Graphic Project Created', project: creating_data })

        }
        return res.status(404).send({ message: 'User not found' })
    }
    return res.status(400).json({ message: "failed to create data " })
})

const updateGraphicDesign = async (req, res) => {
    const _id = req.params.id;

    try {
        const findProject = await graphicDesignModel.findById(_id)
        if (findProject) {
            await findProject.updateOne(req.body)
            return res.status(200).send({ message: 'Project Updated' })
        } else {
            return res.status(404).send({ message: 'Project not found' })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
// Api Needs to be updated 
const deleteGraphicProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "Project not provided Try Login again" })
    }
    try {
        const findProject = await graphicDesignModel.findById(_id)
        if (findProject) {
            let { name, user, _id, project_title } = findProject
            name = name.replace(/\s/g, '')
            project_title = project_title.replace(/\s/g, '')

            // const prefix = `${name}-${user}/${project_title}-${_id}/customer-upload`
            const prefix = `${user}/${_id}/customer-upload`
            const designer_prefix = `${user}/${_id}/designer_upload/`

            const [files] = await bucket.getFiles({ prefix })
            const [desingerFiles] = await bucket.getFiles({ prefix: designer_prefix })

            await Promise.all(
                files?.map(async (file) => {
                    try {
                        await file.delete();
                        // console.log(`Deleted file: ${file.name}`);
                    } catch (error) {
                        throw error
                    }
                })
            ).then(async () => {
                if (desingerFiles.length > 0) {
                    await Promise.all(
                        desingerFiles?.map(async (file) => {
                            try {
                                await file.delete();
                                // console.log(`Deleted file: ${file.name}`);
                            } catch (error) {
                                throw error
                            }
                        })
                    ).then(async () => {
                        await graphicDesignModel.findByIdAndRemove(_id)
                        return res.status(200).send({ message: 'Project Deleted' })
                    }).catch(err => { throw err })
                } else {
                    await graphicDesignModel.findByIdAndRemove(_id)
                    return res.status(200).send({ message: 'Project Deleted' })
                }
            }).catch((err) => { throw err })

        } else {
            res.status(400).send({ message: 'Project not found' })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const deleteFile = async (req, res) => {
    let filePath = ''
    if (req?.body?.folder_name.endsWith("/")) {
        filePath = req.body.folder_name + req.body.file_name
    } else {
        filePath = req.body.folder_name + '/' + req.body.file_name
    }
    try {
        const file = bucket.file(filePath)
        await file.delete().then(() => {
            return res.status(200).send({ message: 'File Deleted Successfully', })
        }).catch((err) => {
            return res.status(500).send({ message: 'Found error try again' })
        })
    }
    catch (error) {
        res.status(500).send({ message: 'Internal Server error' })
    }

}
const getGraphicProject = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "ID not provided Try Login again" })
    }
    const findUser = await User.findOne({ _id: id }).exec()
    if (findUser) {
        const Roles = findUser.roles
        // Project-Manager
        if (findRole(findUser).projectManager) {
            const graphic_projects = await graphicDesignModel.find().exec()
            const mobile_app_projects = await mobileAppModel.find().exec()
            const web_app_projects = await webappModel.find().exec()

            const website_projects = await websiteModal.find().exec()
            const social_media_projects = await socialMediaModal.find().exec()
            const copy_write_projects = await copyWritingModel.find().exec()

            let CustomerProjects = [...graphic_projects, ...mobile_app_projects, ...web_app_projects, ...website_projects, ...social_media_projects, ...copy_write_projects]
            if (CustomerProjects.length > 0) {
                return res.status(200).send({
                    message: 'hello Manager',
                    CustomerProjects
                })
            } else {
                return res.status(200).send({
                    message: 'no projects found', CustomerProjects: []
                })
            }
        }
        // Admin
        else if (findRole(findUser).admin) {
            const graphic_projects = await graphicDesignModel.find().exec()
            const mobile_app_projects = await mobileAppModel.find().exec()
            const web_app_projects = await webappModel.find().exec()
            const website_projects = await websiteModal.find().exec()
            const social_media_projects = await socialMediaModal.find().exec()
            const copy_write_projects = await copyWritingModel.find().exec()
            let CustomerProjects = [...graphic_projects, ...mobile_app_projects, ...web_app_projects, ...website_projects, ...social_media_projects, ...copy_write_projects]

            if (CustomerProjects.length > 0) {
                return res.status(200).send({
                    message: 'Hello Admin',
                    CustomerProjects
                })
            } else {
                return res.status(200).send({
                    message: 'no projects found', CustomerProjects: []
                })
            }
        }
        // Customer
        else if (findRole(findUser).customer) {
            const graphic_projects = await graphicDesignModel.find({ user: id }).exec()
            const mobile_app_projects = await mobileAppModel.find({ user: id }).exec()
            const web_app_projects = await webappModel.find({ user: id }).exec()
            const website_projects = await websiteModal.find({ user: id }).exec()
            const social_media_projects = await socialMediaModal.find({ user: id }).exec()
            const copy_write_projects = await copyWritingModel.find({ user: id }).exec()
            let CustomerProjects = [...graphic_projects, ...mobile_app_projects, ...web_app_projects, ...website_projects, ...social_media_projects, ...copy_write_projects]

            if (CustomerProjects.length > 0) {
                return res.status(200).send({
                    message: 'Hello customer',
                    CustomerProjects
                })
            } else {
                return res.status(200).send({
                    message: 'no projects found', CustomerProjects: []
                })
            }
        }
        // Graphic-Designer
        else if (Roles.includes("Graphic-Designer")) {
            const getList = await graphicDesignModel.find().lean().exec()
            const graphic_projects = await graphicDesignModel.find({ user: id }).exec()
            if (getList) {
                const filteredData = getList.filter(item =>
                    item.team_members.some(member => member._id === id)
                );
                return res.status(200).send({
                    message: 'hello designer', CustomerProjects: [...filteredData, ...graphic_projects]
                })
            }
        }
        // Mobile-App-Developer
        // else if (Roles.includes("Mobile-App-Developer")) {
        //     const getList = await mobileAppModel.find().lean().exec()
        //     if (getList) {
        //         const filteredData = getList.filter(item =>
        //             item.team_members.some(member => member._id === id)
        //         );
        //         // console.log(filteredData);
        //         return res.status(200).send({
        //             message: 'hello Mobile-App-Developer', CustomerProjects: filteredData
        //         })
        //     }
        // }
        // else if (Roles.includes("Copy-Writer")) {
        //     const getList = await copyWritingModel.find().lean().exec()
        //     if (getList) {
        //         // console.log(id)
        //         const filteredData = getList.filter(item =>
        //             item.team_members.some(member => member._id === id)
        //         );
        //         // console.log(filteredData);
        //         return res.status(200).send({
        //             message: 'hello Mobile-App-Developer', CustomerProjects: filteredData
        //         })
        //     }
        // }
        // else if (Roles.includes("Social-Media-Manager")) {
        //     const getList = await copyWritingModel.find().lean().exec()
        //     if (getList) {
        //         // console.log(id)
        //         const filteredData = getList.filter(item =>
        //             item.team_members.some(member => member._id === id)
        //         );
        //         // console.log(filteredData);
        //         return res.status(200).send({
        //             message: 'hello Mobile-App-Developer', CustomerProjects: filteredData
        //         })
        //     }
        // }
        // else if (Roles.includes("Web-Developer")) {
        //     let filtered_website_project = []
        //     let filtered_web_app_project = []
        //     const website_projects = await websiteModal.find().lean().exec()
        //     const web_app_projects = await webAppModel.find().lean().exec()

        //     if (website_projects) {
        //         filtered_website_project = website_projects.filter(item =>
        //             item.team_members.some(member => member._id === id)
        //         );
        //     }
        //     if (web_app_projects) {
        //         filtered_web_app_project = web_app_projects.filter(item =>
        //             item.team_members.some(member => member._id === id)
        //         );
        //     }
        //     return res.status(200).send({
        //         message: 'hello Mobile-App-Developer', CustomerProjects: [...filtered_website_project, ...filtered_web_app_project]
        //     })
        // }
    } else {
        return res.status(400).send({ message: 'User not found' })
    }

})
const duplicateProject = async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const { project_category, name, project_title, design_type, brand, project_description, sizes, specific_software_names, file_formats } = findproject
            const copy_project_title = project_title + " Copy"
            const obj = {
                user, name, project_category, project_title: copy_project_title, design_type, brand, project_description, file_formats,
                sizes, specific_software_names, is_active: false, version: ["1"], status: 'Project manager', team_members: []
            }
            const creatingNewProject = await graphicDesignModel.create(obj)
            if (creatingNewProject) {
                return res.status(201).send({ message: 'Project Duplicated', project: creatingNewProject })
            } else {
                return res.status(400).send({ message: 'Found error while creating project' })

            }
        } else {
            return res.status(404).send({ messsage: 'Project Not Found' })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const projectCompleted = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const updatingStatus = await graphicDesignModel.findByIdAndUpdate(id, { status: 'Completed' })
            if (updatingStatus) {
                return res.status(201).send({ message: 'Project Completed' })
            }
            else {
                return res.status(400).send({ message: 'Found error while Updating Project' })

            }
        } else {
            return res.status(404).send({ messsage: 'Project Not Found' })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }

}
const projectAttend = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const updatingStatus = await graphicDesignModel.findByIdAndUpdate(id, { status: 'Ongoing' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus
                    const msg = `Designer change project status to <b>Ongoing</b>`
                    await sendStatusChangeMailtoCustomer(project_title, email, msg, 'Ongoing')
                }
                return res.status(201).send({ message: 'Project Attended' })
            }
            else {
                return res.status(400).send({ message: 'Found error while Updating Project' })

            }
        } else {
            return res.status(404).send({ messsage: 'Project Not Found' })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const projectOngoing = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const updatingStatus = await graphicDesignModel.findByIdAndUpdate(id, { status: 'Ongoing' })
            if (updatingStatus) {
                return res.status(201).send({ message: 'Project Ongoing' })
            }
            else {
                return res.status(400).send({ message: 'Found error while Updating Project' })

            }
        } else {
            return res.status(404).send({ messsage: 'Project Not Found' })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const projectCancel = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const updatingStatus = await graphicDesignModel.findByIdAndUpdate(id, { status: 'Cancel' })
            if (updatingStatus) {
                return res.status(201).send({ message: 'Project Cancelled' })
            }
            else {
                return res.status(400).send({ message: 'Found error while Updating Project' })

            }
        } else {
            return res.status(404).send({ messsage: 'Project Not Found' })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const projectWidthRevision = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const updatingStatus = await graphicDesignModel.findByIdAndUpdate(id, { status: 'With Revision' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus
                    const msg = `Designer change project status to <b>With Revision</b>`
                    // await sendStatusChangeMailtoCustomer(project_title, email, msg, 'With Revision')
                }
                return res.status(201).send({ message: 'Project status updated for changes' })
            }
            else {
                return res.status(400).send({ message: 'Found error while Updating Project' })

            }
        } else {
            return res.status(404).send({ messsage: 'Project Not Found' })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const projectForReview = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const updatingStatus = await graphicDesignModel.findByIdAndUpdate(id, { status: 'For Review' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus
                    const msg = `Designer change project status to <b>For Review</b>`
                    await sendStatusChangeMailtoCustomer(project_title, email, msg, 'For Review')
                }
                return res.status(201).send({ message: 'Project send for Review' })
            }
            else {
                return res.status(400).send({ message: 'Found error while Updating Project' })

            }
        } else {
            return res.status(404).send({ messsage: 'Project Not Found' })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}


module.exports = { createGraphicDesign, getGraphicProject, deleteGraphicProject, duplicateProject, projectCompleted, projectAttend, projectForReview, deleteFile, projectOngoing, projectCancel, projectWidthRevision, updateGraphicDesign }