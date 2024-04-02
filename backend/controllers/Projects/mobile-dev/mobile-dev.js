const mobileAppModel = require('../../../models/projects/mobile-dev/mobile-dev-model')

const createMobileAppProject = async (req, res) => {
    const { user, name, project_title, platform, project_details, } = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !platform || !project_details) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, team_members : [], platform, project_details, status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const mobileAppProject = new mobileAppModel({ ...obj }).save()
        if (mobileAppProject) {
            return res.status(201).send({ message: "Project Created Successfully" })
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
const deleteMobileAppProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "id not provided Try Login again!" })
    }
    try {
        const mobileAppProject = await mobileAppModel.findByIdAndRemove(_id)
        if (mobileAppProject) {
            return res.status(200).json({ message: "Project Deleted" })
        } else {
            return res.status(500).json({ message: "Failed to delete project" })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}

module.exports = { createMobileAppProject, getMobileAppProjects, deleteMobileAppProject }