const { bucket } = require('../../../google-cloud-storage/gCloudStorage');
const webappModel = require('../../../models/projects/web-app/web-app-model')

const createWebAppProject = async (req, res) => {
    const { user, name, project_title, preferred_stack, backend_tech, project_description, } = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !preferred_stack || !backend_tech || !project_description) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, team_members: [], preferred_stack, backend_tech, project_description, status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const webAppProject = new webappModel({ ...obj }).save()
        if (webAppProject) {
            return res.status(201).send({ message: "Project Created Successfully" })
        } else {
            return res.status(500).send({ message: "Failed to create project" })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
}
const getWebAppProjects = async (req, res) => {
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
            const webAppProjects = await webappModel.find().exec()
            if (webAppProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", webApps: webAppProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Customer') {
            const webAppProject = await webappModel.find({ user })
            if (webAppProject.length > 0) {
                return res.status(200).json({ message: "Project Found", webApps: webAppProject })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Web-Developer') {
            const webAppProject = await webappModel.find().lean()
            if (webAppProject.length > 0) {
                const assignedProjects = webAppProject.filter(item =>
                    item.team_members.some(member => member._id === user)
                )
                if (assignedProjects.length > 0) {
                    return res.status(200).json({ message: "Project Found", webApps: assignedProjects })
                } else {
                    return res.status(404).json({ message: "Projects Not Found" })
                }
            }
        }
        else {
            return res.status(400).json({ message: "You are not authorized" })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
// const deleteWebAppProject = async (req, res) => {
//     const _id = req.params.id
//     if (!_id) {
//         return res.status(400).json({ message: "id not provided Try Login again!" })
//     }
//     try {
//         const webAppProjects = await webappModel.findByIdAndRemove(_id)
//         if (webAppProjects) {
//             return res.status(200).json({ message: "Project Deleted" })
//         } else {
//             return res.status(500).json({ message: "Failed to delete project" })
//         }
//     } catch (err) {
//         res.status(500).send({ message: "Internal Server Error" })
//     }
// }
const projectWebAppWidthRevision = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await webappModel.findById(id)
        if (findproject) {
            const updatingStatus = await webappModel.findByIdAndUpdate(id, { status: 'With Revision' })
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
const projectWebAppForReview = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await webappModel.findById(id)
        if (findproject) {
            const updatingStatus = await webappModel.findByIdAndUpdate(id, { status: 'For Review' })
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
const projectWebAppAttend = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await webappModel.findById(id)
        if (findproject) {
            const updatingStatus = await webappModel.findByIdAndUpdate(id, { status: 'Ongoing' })
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

const duplicateWebAppProject = async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await webappModel.findById(id)
        if (findproject) {
            const { project_category, name, project_title, project_description, preferred_stack, backend_tech } = findproject
            const copy_project_title = project_title + " Copy"
            const obj = {
                user, name, project_category, project_title: copy_project_title, project_description, preferred_stack, backend_tech,
                is_active: false, version: ["1"], status: 'Project manager', team_members: [], figma_link: '', drive_link: ''
            }
            const creatingNewProject = await webappModel.create(obj)
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
const projectWebAppCompleted = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await webappModel.findById(id)
        if (findproject) {
            const updatingStatus = await webappModel.findByIdAndUpdate(id, { status: 'Completed' })
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
const projectWebAppCancel = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await webappModel.findById(id)
        if (findproject) {
            const updatingStatus = await webappModel.findByIdAndUpdate(id, { status: 'Cancel' })
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
const deleteWebAppProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "Project not provided Try Login again" })
    }
    try {
        const findProject = await webappModel.findById(_id)
        if (findProject) {
            let { user, _id } = findProject
            const prefix = `${user}/${_id}/customer-upload`
            const webAppProjects = `${user}/${_id}/designer_upload/`

            const [files] = await bucket.getFiles({ prefix })
            const [web_app_projects] = await bucket.getFiles({ prefix: webAppProjects })

            await Promise.all(
                files?.map(async (file) => {
                    try {
                        await file.delete();
                    } catch (error) {
                        throw error
                    }
                })
            ).then(async () => {
                if (web_app_projects.length > 0) {
                    await Promise.all(
                        web_app_projects?.map(async (file) => {
                            try {
                                await file.delete();
                            } catch (error) {
                                throw error
                            }
                        })
                    ).then(async () => {
                        await webappModel.findByIdAndRemove(_id)
                        return res.status(200).send({ message: 'Project Deleted' })
                    }).catch(err => { throw err })
                } else {
                    await webappModel.findByIdAndRemove(_id)
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


module.exports = { createWebAppProject, getWebAppProjects, deleteWebAppProject, projectWebAppAttend, projectWebAppForReview, projectWebAppWidthRevision, projectWebAppCancel, projectWebAppCompleted, duplicateWebAppProject }