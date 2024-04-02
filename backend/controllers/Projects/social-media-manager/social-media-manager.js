const socialMediaModel = require("../../../models/projects/social-media-modal/social-media-modal")

const createSocialMediaProject = async (req, res) => {
    const { user, name, project_title, service_type, platforms, plan, project_details, } = req.body;

    if (!user || !name) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !service_type || !platforms || !project_details || !plan) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }

    try {
        const obj = {
            user, name, project_title, team_members: [], service_type, platforms, plan, project_details, status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const socialMedia = new socialMediaModel({ ...obj }).save()
        if (socialMedia) {
            return res.status(201).send({ message: "Project Created Successfully" })
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

const deleteSocialMediaProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "id not provided Try Login again!" })
    }
    try {
        const socialMediaProject = await socialMediaModel.findByIdAndRemove(_id)
        if (socialMediaProject) {
            return res.status(200).json({ message: "Project Deleted" })
        } else {
            return res.status(500).json({ message: "Failed to delete project" })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}

module.exports = { createSocialMediaProject, getSocialMediaProjects, deleteSocialMediaProject }