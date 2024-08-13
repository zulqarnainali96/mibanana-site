const { bucket } = require("../../../google-cloud-storage/gCloudStorage");
const socialMediaModel = require("../../../models/projects/social-media-modal/social-media-modal")

const createSocialMediaProject = async (req, res) => {
    const { user, name, project_title, service_type, brand, platforms, plan, project_description, project_category} = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !service_type || !platforms || !project_description || !plan) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, project_category, team_members: [], service_type, brand: brand !== null ? brand : {}, platforms, plan, project_description, status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const socialMedia = await socialMediaModel.create(obj)
        if (socialMedia) {
            return res.status(201).send({ message: "Project Created Successfully", socialMedia })
        } else {
            return res.status(500).send({ message: "Failed to create project" })
        }

    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
}

const getSocialMediaProjects = async (req, res) => {
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
            const socialMediaProjects = await socialMediaModel.find().exec()
            if (socialMediaProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", socialMedia: socialMediaProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Customer') {
            const socialMediaProjects = await socialMediaModel.find({ user })
            if (socialMediaProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", socialMedia: socialMediaProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        } else if (role === 'Social-Media-Manager') {
            const socialMediaProjects = await socialMediaModel.find().lean()
            if (socialMediaProjects.length > 0) {
                const assignedProjects = socialMediaProjects.filter(item =>
                    item.team_members.some(member => member._id === user)
                )
                if (assignedProjects.length > 0) {
                    return res.status(200).json({ message: "Project Found", socialMedia: assignedProjects })
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

// const deleteSocialMediaProject = async (req, res) => {
//     const _id = req.params.id
//     if (!_id) {
//         return res.status(400).json({ message: "id not provided Try Login again!" })
//     }
//     try {
//         const socialMediaProject = await socialMediaModel.findByIdAndRemove(_id)
//         if (socialMediaProject) {
//             return res.status(200).json({ message: "Project Deleted" })
//         } else {
//             return res.status(500).json({ message: "Failed to delete project" })
//         }
//     } catch (err) {
//         res.status(500).send({ message: "Internal Server Error" })
//     }
// }
const projectSocialMediaWidthRevision = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await socialMediaModel.findById(id)
        if (findproject) {
            const updatingStatus = await socialMediaModel.findByIdAndUpdate(id, { status: 'With Revision' })
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
const projecSocialMediaForReview = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await socialMediaModel.findById(id)
        if (findproject) {
            const updatingStatus = await socialMediaModel.findByIdAndUpdate(id, { status: 'For Review' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Social Media Manager change project status to <b>For Review</b>`
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
const projectSocialMediaAttend = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await socialMediaModel.findById(id)
        if (findproject) {
            const updatingStatus = await socialMediaModel.findByIdAndUpdate(id, { status: 'Ongoing' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Social Media Manager change project status to <b>Ongoing</b>`
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

const duplicateSocialMediaProject = async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await socialMediaModel.findById(id)
        if (findproject) {
            const { project_category, name, project_title, project_description, service_type, platforms, plan, } = findproject
            const copy_project_title = project_title + " Copy"
            const obj = {
                user, name, project_category, project_title: copy_project_title, project_description, service_type, platforms, plan,
                is_active: false, version: ["1"], status: 'Project manager', team_members: [], figma_link: '', drive_link: ''
            }
            const creatingNewProject = await socialMediaModel.create(obj)
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
const projectSocialMediaCompleted = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await socialMediaModel.findById(id)
        if (findproject) {
            const updatingStatus = await socialMediaModel.findByIdAndUpdate(id, { status: 'Completed' })
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
const projectSocialMediaCancel = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await socialMediaModel.findById(id)
        if (findproject) {
            const updatingStatus = await socialMediaModel.findByIdAndUpdate(id, { status: 'Cancel' })
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
const deleteSocialMediaProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "Project not provided Try Login again" })
    }
    try {
        const findProject = await socialMediaModel.findById(_id)
        if (findProject) {
            let { user, _id } = findProject
            const prefix = `${user}/${_id}/customer-upload`
            const social_media = `${user}/${_id}/designer_upload/`

            const [files] = await bucket.getFiles({ prefix })
            const [socialMediaFiles] = await bucket.getFiles({ prefix: social_media })

            await Promise.all(
                files?.map(async (file) => {
                    try {
                        await file.delete();
                    } catch (error) {
                        throw error
                    }
                })
            ).then(async () => {
                if (socialMediaFiles.length > 0) {
                    await Promise.all(
                        socialMediaFiles?.map(async (file) => {
                            try {
                                await file.delete();
                            } catch (error) {
                                throw error
                            }
                        })
                    ).then(async () => {
                        await socialMediaModel.findByIdAndRemove(_id)
                        return res.status(200).send({ message: 'Project Deleted' })
                    }).catch(err => { throw err })
                } else {
                    await socialMediaModel.findByIdAndRemove(_id)
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
module.exports = { createSocialMediaProject, getSocialMediaProjects, deleteSocialMediaProject, projectSocialMediaWidthRevision, projecSocialMediaForReview, projectSocialMediaAttend, projectSocialMediaCompleted, duplicateSocialMediaProject, projectSocialMediaCancel }