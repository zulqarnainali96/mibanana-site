const { bucket } = require("../../../google-cloud-storage/gCloudStorage");
const User = require("../../../models/UsersLogin");
const copyWritingModel = require("../../../models/projects/copy-writing/copy-writing-model");
const path = require('path')
const uniqID = require('uuid').v4

const createCopyWritingProject = async (req, res) => {
    const { user, name, project_title, copy_writing_service, word_count, project_details, } = req.body;

    if (!user) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !copy_writing_service || !word_count || !project_details) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, team_members: [], copy_writing_service, word_count, project_details,
            status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const copyWriting = new copyWritingModel({ ...obj }).save()
        if (copyWriting) {
            return res.status(201).send({ message: "Project Created Successfully" })
        } else {
            return res.status(500).send({ message: "Failed to create project" })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
}
const getCopyWritingProject = async (req, res) => {
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
            const copyWritingProjects = await copyWritingModel.find().exec()
            if (copyWritingProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", copywriting: copyWritingProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        }
        else if (role === 'Customer') {
            const copyWritingProjects = await copyWritingModel.find({ user })
            if (copyWritingProjects.length > 0) {
                return res.status(200).json({ message: "Project Found", copywriting: copyWritingProjects })
            } else {
                return res.status(404).json({ message: "Projects Not Found" })
            }
        } else if (role === 'Copy-Writer') {
            const copyWritingProjects = await copyWritingModel.find().lean()
            console.log(copyWritingProjects)
            if (copyWritingProjects.length > 0) {
                const assignedProjects = copyWritingProjects.filter(item =>
                    item.team_members.some(member => member._id === user)
                )
                if (assignedProjects.length > 0) {
                    return res.status(200).json({ message: "Project Found", copywriting: assignedProjects })
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
const deleteCopyWritingProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "id not provided Try Login again!" })
    }
    try {
        const copyWritingProjects = await copyWritingModel.findByIdAndRemove(_id)
        if (copyWritingProjects) {
            return res.status(200).json({ message: "Project Deleted" })
        } else {
            return res.status(500).json({ message: "Failed to delete project" })
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const uploadFilesCopywrite = async (req, res) => {
    const _id = req.params.id;
    const userId = req.params.user;
    const files = req.files
    if (!files) {
        return res.status(400).send({ message: "No files uploaded" })
    }

    try {
        const user = await User.findById({ user: userId });
        if (user) {
            const copyWritingProject = await copyWritingModel.findById(_id).lean()
            if (copyWritingProject) {
                const { _id: userID, } = user
                const { _id: project_id, project_title } = copyWritingProject
                const prefix = `${userID}/${project_title}/${project_id}/`
                const options = {
                    resumable: false,
                    preconditionOpts: {
                        ifGenerationMatch: generationMatchPreCondition
                    },
                }
                if (files.length > 0) {
                    for (const i = 0; i < files.length; i++) {
                        const file = files[i];
                        const blob = bucket.file(prefix + file.originalname)
                        blob.createWriteStream(options).on('error', (err) => {
                            return res.status(500).send({ message: "Error uploading file" });
                        }).on('finish', async () => {
                            const [files] = await bucket.getFiles({ prefix })
                            let filesInfo = files.map((file) => {
                                let obj = {}
                                obj.id = uniqID(),
                                    obj.name = path.basename(file.name),
                                    obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                                    obj.download_link = file.metadata.mediaLink,
                                    obj.type = file.metadata.contentType,
                                    obj.size = file.metadata.size,
                                    obj.time = file.metadata.timeCreated,
                                    obj.upated_time = file.metadata.updated,
                                    obj.folder_name = prefix
                                obj.folder_dir = "Copy-Writing"
                                return obj
                            })
                            if (filesInfo) {
                                if (copyWritingProject.files?.length > 0) {
                                    copyWritingProject.files = [...copyWritingProject.files, ...filesInfo]
                                } else {
                                    copyWritingProject.files = filesInfo
                                }
                            }
                            // return res.status(200).send({ message: "File uploaded successfully" });
                        }).end(file.buffer)
                    }
                }
            } else {
                return res.status(400).send({ message: "No files uploaded" })
            }
        } else {
            return res.status(404).send({ message: "User not found Try Login again" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
}


module.exports = { createCopyWritingProject, getCopyWritingProject, deleteCopyWritingProject, uploadFilesCopywrite }
