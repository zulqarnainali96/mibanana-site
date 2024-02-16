const asyncHandler = require("express-async-handler")
const User = require('../models/UsersLogin')
const graphicDesignModel = require("../models/graphic-design-model")
const { bucket } = require('../google-cloud-storage/gCloudStorage')
const Projects = require('../models/graphic-design-model')
const { v4: uniqID } = require('uuid')
const path = require('path')

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
                status: 'Project manager',

                // resources,
                // reference_example,
                // describe_audience,
                // add_files,
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
const upadteProject = asyncHandler(async (req, res) => {
    const { project_id, project_data } = req.body
    if (!project_id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    const { team_members, is_active, status } = project_data
    if (project_id) {
        const findingProj = await graphicDesignModel.findById(project_id)
        if (findingProj) {
            if (findingProj.team_members.length > 0) {
                // findingProj.team_members = [...findingProj.team_members, ...team_members]
                return res.status(201).send({ message: 'Already Assigned to Designer', })
            } else {
                findingProj.team_members = team_members
                findingProj.status = status
                findingProj.is_active = is_active
                const save = await findingProj.save()
                return res.status(201).send({ message: 'Project Updated', save })
            }
        }
    }
    res.status(404).send({ message: "No Project Found" })
})
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

            const prefix = `${name}-${user}/${project_title}-${_id}/customer-upload`
            const designer_prefix = `${name}-${user}/${project_title}-${_id}/designer_upload/`

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
            console.log(err)
            return res.status(500).send({ message: 'Found error try again' })
        })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }

}
const getGraphicProject = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (id) {
        const findUser = await User.findOne({ _id: id }).exec()
        if (findUser) {
            const Roles = findUser.roles
            if (Roles.includes("Project-Manager")) {
                const CustomerProjects = await graphicDesignModel.find().lean()
                return res.status(200).send({
                    message: 'hello Project manager', CustomerProjects
                })
            }
            else if (Roles.includes("Admin")) {
                const CustomerProjects = await graphicDesignModel.find().lean()
                return res.status(200).send({
                    message: 'hello Admin', CustomerProjects
                })
            }
            else if (Roles.includes("Customer")) {
                const CustomerProjects = await graphicDesignModel.find({ user: id }).exec()
                if (CustomerProjects) {
                    return res.status(200).send({
                        message: 'hello customer',
                        CustomerProjects
                    })
                }
            }
            else if (Roles.includes("Graphic-Designer")) {
                const getList = await graphicDesignModel.find().lean().exec()
                if (getList) {
                    // console.log(id)
                    const filteredData = getList.filter(item =>
                        item.team_members.some(member => member._id === id)
                    );
                    // console.log(filteredData);
                    return res.status(200).send({
                        message: 'hello designer', CustomerProjects: filteredData
                    })
                }
            }
        }
    }
    return res.status(404).send('Data not available')

})
const getCustomerFiles = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            let project_titl = project_title.replace(/\s/g, '')
            let names = name.replace(/\s/g, '')
            const prefix = `${names}-${user}/${project_titl}-${_id}/customer-upload`
            // console.log(prefix)
            const [files] = await bucket.getFiles({ prefix })
            // console.log(files)
            let filesInfo = files?.map((file) => {
                let obj = {}
                obj.id = uniqID(),
                    obj.name = path.basename(file.name),
                    obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                    obj.download_link = file.metadata.mediaLink
                obj.type = file.metadata.contentType
                obj.size = file.metadata.size
                obj.time = file.metadata.timeCreated
                obj.upated_time = file.metadata.updated
                obj.folder_name = prefix
                obj.folder_dir = "Customer"
                return obj
            })
            // console.log(filesInfo)
            if (filesInfo.length > 0) {
                return res.status(200).send({ message: 'Files fount', filesInfo })
            }
            if (filesInfo.length === 0 && files.length === 0) {
                return res.status(404).send({ message: 'No Files Found' })
            }
        }
    } catch (error) {
        // console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const duplicateProject = async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    console.log(id)
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        if (findproject) {
            const { project_category, name, project_title, design_type, brand, project_description, sizes, specific_software_names, file_formats } = findproject
            const copy_project_title = project_title + " Copy"
            const obj = {
                user, name, project_category, project_title:copy_project_title, design_type, brand, project_description, file_formats,
                sizes, specific_software_names, is_active: false, version: ["1"], status: 'Project manager', team_members: []
            }
            // console.log(obj)
            const creatingNewProject = await graphicDesignModel.create(obj)
            // console.log(creatingNewProject)
            if (creatingNewProject) {
                return res.status(201).send({ message: 'Project Duplicate Done', project: creatingNewProject })
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
    // console.log('worlkonfas')
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await graphicDesignModel.findById(id)
        // console.log(id)
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
                return res.status(201).send({ message: 'Project Cancel' })
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

module.exports = { createGraphicDesign, getGraphicProject, upadteProject, deleteGraphicProject, getCustomerFiles, duplicateProject, projectCompleted, projectAttend, projectForReview, deleteFile, projectOngoing, projectCancel }