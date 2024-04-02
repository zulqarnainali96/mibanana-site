const webappModel = require('../../../models/projects/web-app/web-app-model')

const createWebAppProject = async (req, res) => {
    const { user, name, project_title, preferred_stack, backend_tech, project_details, } = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !preferred_stack || !backend_tech || !project_details) {
        return res.status(400).send({ message: "Please provide all required fields" })
}
    try {
        const obj = {
            user, name, project_title, team_members: [], preferred_stack, backend_tech, project_details, status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
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
const deleteWebAppProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "id not provided Try Login again!" })
    }
    try {
        const webAppProjects = await webappModel.findByIdAndRemove(_id)
        if (webAppProjects) {
            return res.status(200).json({ message: "Project Deleted" })
        } else {
            return res.status(500).json({ message: "Failed to delete project" })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}

module.exports = { createWebAppProject, getWebAppProjects, deleteWebAppProject }