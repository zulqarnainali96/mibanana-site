const { bucket } = require("../../../google-cloud-storage/gCloudStorage");
const websiteModal = require("../../../models/projects/website-model/website-model")

const createWebsiteProject = async (req, res) => {
    const { user, name, project_title, website_type, preferred_stack, project_description, } = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !website_type || !preferred_stack || !project_description) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, team_members: [], website_type, preferred_stack, project_description,
            status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const webisteProject = new websiteModal({ ...obj }).save()
        if (webisteProject) {
            return res.status(201).send({ message: "Project Created Successfully" })
        } else {
            return res.status(500).send({ message: "Failed to create project" })
        }

    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
}
const getWebsiteProjects = async (req, res) => {
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
            const webisteProjects = await websiteModal.find().exec()
            if (webisteProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", websites: webisteProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Customer') {
            const webisteProjects = await websiteModal.find({ user })
            if (webisteProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", websites: webisteProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Web-Developer') {
            const webisteProjects = await websiteModal.find().lean()
            if (webisteProjects.length > 0) {
                const assignedProjects = webisteProjects.filter(item =>
                    item.team_members.some(member => member._id === user)
                )
                if (assignedProjects.length > 0) {
                    return res.status(200).json({ message: "Project Found", websites: assignedProjects })
                } else {
                    return res.status(404).json({ message: "Projects Not Found" })
                }
            }
        }
        else {
            return res.status(400).json({ message: "You are not authorized" })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
// const deleteWebsiteProject = async (req, res) => {
//     const _id = req.params.id
//     if (!_id) {
//         return res.status(400).json({ message: "id not provided Try Login again!" })
//     }
//     try {
//         const webisteProjects = await websiteModal.findByIdAndRemove(_id)
//         if (webisteProjects) {
//             return res.status(200).json({ message: "Project Deleted" })
//         } else {
//             return res.status(500).json({ message: "Failed to delete project" })
//         }
//     } catch (err) {
//         res.status(500).send({ message: "Internal Server Error" })
//     }
// }
const projectWebsiteWidthRevision = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await websiteModal.findById(id)
        if (findproject) {
            const updatingStatus = await websiteModal.findByIdAndUpdate(id, { status: 'With Revision' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Web Developer change project status to <b>With Revision</b>`
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
const projectWebsiteForReview = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await websiteModal.findById(id)
        if (findproject) {
            const updatingStatus = await websiteModal.findByIdAndUpdate(id, { status: 'For Review' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Web Developer change project status to <b>For Review</b>`
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
const projectWebsiteAttend = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await web.findById(id)
        if (findproject) {
            const updatingStatus = await web.findByIdAndUpdate(id, { status: 'Ongoing' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `Web Developer change project status to <b>Ongoing</b>`
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

const duplicateWebsiteProject = async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await websiteModal.findById(id)
        if (findproject) {
            const { project_category, name, project_title, project_description, website_type, preferred_stack } = findproject
            const copy_project_title = project_title + " Copy"
            const obj = {
                user, name, project_category, project_title: copy_project_title, project_description, website_type, preferred_stack,
                is_active: false, version: ["1"], status: 'Project manager', team_members: [], figma_link: '', drive_link: ''
            }
            const creatingNewProject = await websiteModal.create(obj)
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
const projectWebsiteCompleted = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await websiteModal.findById(id)
        if (findproject) {
            const updatingStatus = await websiteModal.findByIdAndUpdate(id, { status: 'Completed' })
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
const projectWebsiteCancel = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await websiteModal.findById(id)
        if (findproject) {
            const updatingStatus = await websiteModal.findByIdAndUpdate(id, { status: 'Cancel' })
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
const deleteWebsiteProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "Project not provided Try Login again" })
    }
    try {
        const findProject = await websiteModal.findById(_id)
        if (findProject) {
            let { user, _id } = findProject
            const prefix = `${user}/${_id}/customer-upload`
            const website_projects = `${user}/${_id}/designer_upload/`

            const [files] = await bucket.getFiles({ prefix })
            const [website_files] = await bucket.getFiles({ prefix: website_projects })

            await Promise.all(
                files?.map(async (file) => {
                    try {
                        await file.delete();
                    } catch (error) {
                        throw error
                    }
                })
            ).then(async () => {
                if (website_files.length > 0) {
                    await Promise.all(
                        website_files?.map(async (file) => {
                            try {
                                await file.delete();
                            } catch (error) {
                                throw error
                            }
                        })
                    ).then(async () => {
                        await websiteModal.findByIdAndRemove(_id)
                        return res.status(200).send({ message: 'Project Deleted' })
                    }).catch(err => { throw err })
                } else {
                    await websiteModal.findByIdAndRemove(_id)
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

module.exports = { createWebsiteProject, getWebsiteProjects, deleteWebsiteProject, projectWebsiteAttend, projectWebsiteForReview, projectWebsiteWidthRevision, duplicateWebsiteProject, projectWebsiteCancel, projectWebsiteCompleted }