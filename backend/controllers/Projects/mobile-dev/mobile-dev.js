const { bucket } = require('../../../google-cloud-storage/gCloudStorage');
const mobileAppModel = require('../../../models/projects/mobile-dev/mobile-dev-model')
const User = require('../../../models/UsersLogin');
const { sendStatusChangeMailtoCustomer } = require('../../../utils/sendMail');

const createMobileAppProject = async (req, res) => {
    const { user, name, project_title, platform, project_description, } = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !platform || !project_description) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, team_members: [], platform, project_description, status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const mobileAppProject = await mobileAppModel.create(obj)
        if (mobileAppProject) {
            return res.status(201).send({ message: "Project Created Successfully", mobileAppProject })
        } else {
            return res.status(500).send({ message: "Failed to create project" })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
}
const getMobileAppProjects = async (req, res) => {
    const user = req.params.id
    const role = req.body.role
    if (!user) {
        return res.status(400).json({ message: "id not provided Try Login again!" })
    }
    if (!role) {
        return res.status(400).json({ message: "role not found" })
    }
    try {
        if (role === 'Project-Manager') {
            const mobileAppProject = await mobileAppModel.find().exec()
            if (mobileAppProject.length > 0) {
                return res.status(200).json({ message: "Project Found", mobileApps: mobileAppProject })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Customer') {
            const mobileAppProject = await mobileAppModel.find({ user })
            if (mobileAppProject.length > 0) {
                return res.status(200).json({ message: "Project Found", mobileApps: mobileAppProject })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        } else if (role === 'Mobile-App-Developer') {
            const mobileAppProject = await mobileAppModel.find().lean()
            if (mobileAppProject.length > 0) {
                const assignedProjects = mobileAppProject.filter(item =>
                    item.team_members.some(member => member._id === user)
                )
                if (assignedProjects.length > 0) {
                    return res.status(200).json({ message: "Project Found", mobileApps: assignedProjects })
                } else {
                    return res.status(404).json({ message: "Projects Not Found" })
                }
            }
        } else {
            return res.status(400).json({ message: "You are not authorized" })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const projectMobileWidthRevision = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await mobileAppModel.findById(id)
        if (findproject) {
            const updatingStatus = await mobileAppModel.findByIdAndUpdate(id, { status: 'With Revision' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Mobile App Developer change project status to <b>With Revision</b>`
                    // await sendStatusChangeMailtoCustomer(project_title, email, msg, 'With Revision')
                }
                return res.status(201).send({ message: 'Project status updated' })
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
const projectMobileForReview = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await mobileAppModel.findById(id)
        if (findproject) {
            const updatingStatus = await mobileAppModel.findByIdAndUpdate(id, { status: 'For Review' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Mobile App Developer change project status to <b>For Review</b>`
                    await sendStatusChangeMailtoCustomer(project_title, email, msg, 'For Review')
                }
                return res.status(201).send({ message: 'Project status updated' })
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
const projectMobileAttend = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await mobileAppModel.findById(id)
        if (findproject) {
            const updatingStatus = await mobileAppModel.findByIdAndUpdate(id, { status: 'Ongoing' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Mobile App Developer change project status to <b>Ongoing</b>`
                    await sendStatusChangeMailtoCustomer(project_title, email, msg, 'Ongoing')
                }
                return res.status(201).send({ message: 'Project status updated' })
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
// const deleteMobileAppProject = async (req, res) => {
//     const _id = req.params.id
//     if (!_id) {
//         return res.status(400).json({ message: "id not provided Try Login again!" })
//     }
//     try {
//         const mobileAppProject = await mobileAppModel.findByIdAndRemove(_id)
//         if (mobileAppProject) {
//             return res.status(200).json({ message: "Project Deleted" })
//         } else {
//             return res.status(500).json({ message: "Failed to delete project" })
//         }
//     } catch (err) {
//         res.status(500).send({ message: "Internal Server Error" })
//     }
// }

const duplicateMobileAppProject = async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await mobileAppModel.findById(id)
        if (findproject) {
            const { project_category, name, project_title, project_description, platform } = findproject
            const copy_project_title = project_title + " Copy"
            const obj = {
                user, name, project_category, project_title: copy_project_title, project_description, platform,
                is_active: false, version: ["1"], status: 'Project manager', team_members: [], figma_link: '', drive_link: ''
            }
            const creatingNewProject = await mobileAppModel.create(obj)
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
const projectMobileAppCompleted = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await mobileAppModel.findById(id)
        if (findproject) {
            const updatingStatus = await mobileAppModel.findByIdAndUpdate(id, { status: 'Completed' })
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
const projectMobileAppCancel = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await mobileAppModel.findById(id)
        if (findproject) {
            const updatingStatus = await mobileAppModel.findByIdAndUpdate(id, { status: 'Cancel' })
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
const deleteMobileAppProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "Project not provided Try Login again" })
    }
    try {
        const findProject = await mobileAppModel.findById(_id)
        if (findProject) {
            let { user, _id } = findProject
            const prefix = `${user}/${_id}/customer-upload`
            const mobile_project = `${user}/${_id}/designer_upload/`

            const [files] = await bucket.getFiles({ prefix })
            const [mobile_projects] = await bucket.getFiles({ prefix: mobile_project })

            await Promise.all(
                files?.map(async (file) => {
                    try {
                        await file.delete();
                    } catch (error) {
                        throw error
                    }
                })
            ).then(async () => {
                if (mobile_projects.length > 0) {
                    await Promise.all(
                        mobile_projects?.map(async (file) => {
                            try {
                                await file.delete();
                            } catch (error) {
                                throw error
                            }
                        })
                    ).then(async () => {
                        await mobileAppModel.findByIdAndRemove(_id)
                        return res.status(200).send({ message: 'Project Deleted' })
                    }).catch(err => { throw err })
                } else {
                    await mobileAppModel.findByIdAndRemove(_id)
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

module.exports = { createMobileAppProject, getMobileAppProjects, projectMobileWidthRevision, deleteMobileAppProject, projectMobileAttend, projectMobileForReview, projectMobileAppCancel, projectMobileAppCompleted, duplicateMobileAppProject }