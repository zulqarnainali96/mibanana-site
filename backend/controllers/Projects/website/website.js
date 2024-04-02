const WebsiteModal = require("../../../models/projects/website-model/website-model")

const createWebsiteProject = async (req, res) => {
    const { user, name, project_title, website_type, preferred_stack, project_details, } = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !website_type || !preferred_stack || !project_details) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, team_members: [], website_type, preferred_stack, project_details,
            status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const webisteProject = new WebsiteModal({ ...obj }).save()
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
            const webisteProjects = await WebsiteModal.find().exec()
            if (webisteProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", websites: webisteProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Customer') {
            const webisteProjects = await WebsiteModal.find({ user })
            if (webisteProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", websites: webisteProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Web-Developer') {
            const webisteProjects = await WebsiteModal.find().lean()
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
const deleteWebsiteProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "id not provided Try Login again!" })
    }
    try {
        const webisteProjects = await WebsiteModal.findByIdAndRemove(_id)
        if (webisteProjects) {
            return res.status(200).json({ message: "Project Deleted" })
        } else {
            return res.status(500).json({ message: "Failed to delete project" })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}

module.exports = { createWebsiteProject, getWebsiteProjects, deleteWebsiteProject }