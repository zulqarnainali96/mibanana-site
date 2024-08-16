const { bucket } = require("../../../google-cloud-storage/gCloudStorage");
const User = require("../../../models/UsersLogin");
const copyWritingModel = require("../../../models/projects/copy-writing/copy-writing-model");
const path = require('path');
const { sendStatusChangeMailtoCustomer } = require("../../../utils/sendMail");
const uniqID = require('uuid').v4

const createCopyWritingProject = async (req, res) => {
    const { user, name, project_title, role, copy_writing_service, word_count, project_description, brand } = req.body;

    if (!user) {
        return res.status(400).send({ message: "id not provided Try Login again!" })
    }
    if (!project_title || !copy_writing_service || !word_count || !project_description) {
        return res.status(400).send({ message: "Please provide all required fields" })
    }
    try {
        const obj = {
            user, name, project_title, role, team_members: [], brand: brand !== null ? brand : {}, copy_writing_service, word_count, project_description,
            status: "Project manager", is_active: false, version: ["1"], drive_link: "", figma_link: "",
        }
        const copyWriting = await copyWritingModel.create(obj)
        if (copyWriting) {
            return res.status(201).send({ message: "Project Created Successfully", copyWriting })
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
// const deleteCopyWritingProject = async (req, res) => {
//     const _id = req.params.id
//     if (!_id) {
//         return res.status(400).json({ message: "id not provided Try Login again!" })
//     }
//     try {
//         const copyWritingProjects = await copyWritingModel.findByIdAndRemove(_id)
//         if (copyWritingProjects) {
//             return res.status(200).json({ message: "Project Deleted" })
//         } else {
//             return res.status(500).json({ message: "Failed to delete project" })
//         }
//     } catch (err) {
//         res.status(500).send({ message: "Internal Server Error" })
//     }
// }
const uploadFilesCopywrite = async (req, res) => {
    const _id = req.params.id;
    const userId = req.params.userId;
    const files = req.files
    if (!files) {
        return res.status(400).send({ message: "No files uploaded" })
    }
    try {
        const user = await User.findById({ user: userId });
        if (user) {
            const copyWritingProject = await copyWritingModel.findById(_id).lean()
            if (copyWritingProject) {
                // const { _id: userID, } = user
                const { _id: project_id } = copyWritingProject
                const prefix = `${userId}/projects/${project_id}/customer-upload/`
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
                                    await copyWritingProject.save()
                                } else {
                                    copyWritingProject.files = filesInfo
                                    await copyWritingProject.save()
                                }
                            }
                            return res.status(200).send({ message: "File uploaded successfully" });
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

const projectCopyWriteWidthRevision = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await copyWritingModel.findById(id)
        if (findproject) {
            const updatingStatus = await copyWritingModel.findByIdAndUpdate(id, { status: 'With Revision' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `CopyWriter change project status to <b>With Revision</b>`
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
const projectCopyWriteForReview = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await copyWritingModel.findById(id)
        if (findproject) {
            const updatingStatus = await copyWritingModel.findByIdAndUpdate(id, { status: 'For Review' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `CopyWriter change project status to <b>For Review</b>`
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
const projectCopyWriteAttend = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await copyWritingModel.findById(id)
        if (findproject) {
            const updatingStatus = await copyWritingModel.findByIdAndUpdate(id, { status: 'Ongoing' })
            if (updatingStatus) {
                const project_user = await User.findById({ _id: updatingStatus.user })
                if (project_user) {
                    const { email } = project_user
                    const { project_title } = updatingStatus

                    const msg = `CopyWriter change project status to <b>Ongoing</b>`
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

const duplicateCopyWritingProject = async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await copyWritingModel.findById(id)
        if (findproject) {
            const { project_category, name, project_title, project_description, word_count, copy_writing_service } = findproject
            const copy_project_title = project_title + " Copy"
            const obj = {
                user, name, project_category, project_title: copy_project_title, project_description, word_count, copy_writing_service,
                is_active: false, version: ["1"], status: 'Project manager', team_members: [], figma_link: '', drive_link: ''
            }
            const creatingNewProject = await copyWritingModel.create(obj)
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
const projectCopyWritingCompleted = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await copyWritingModel.findById(id)
        if (findproject) {
            const updatingStatus = await copyWritingModel.findByIdAndUpdate(id, { status: 'Completed' })
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
const projectCopyWritingCancel = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const findproject = await copyWritingModel.findById(id)
        if (findproject) {
            const updatingStatus = await copyWritingModel.findByIdAndUpdate(id, { status: 'Cancel' })
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
const deleteCopyWritingProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "Project not provided Try Login again" })
    }
    try {
        const findProject = await copyWritingModel.findById(_id)
        if (findProject) {
            let { user, _id } = findProject
            const prefix = `${user}/${_id}/customer-upload`
            const copy_write_projects = `${user}/${_id}/designer_upload/`

            const [files] = await bucket.getFiles({ prefix })
            const [copy_wtiting_files] = await bucket.getFiles({ prefix: copy_write_projects })

            await Promise.all(
                files?.map(async (file) => {
                    try {
                        await file.delete();
                    } catch (error) {
                        throw error
                    }
                })
            ).then(async () => {
                if (copy_wtiting_files.length > 0) {
                    await Promise.all(
                        copy_wtiting_files?.map(async (file) => {
                            try {
                                await file.delete();
                            } catch (error) {
                                throw error
                            }
                        })
                    ).then(async () => {
                        await copyWritingModel.findByIdAndRemove(_id)
                        return res.status(200).send({ message: 'Project Deleted' })
                    }).catch(err => { throw err })
                } else {
                    await copyWritingModel.findByIdAndRemove(_id)
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



module.exports = { createCopyWritingProject, getCopyWritingProject, deleteCopyWritingProject, uploadFilesCopywrite, projectCopyWriteWidthRevision, projectCopyWriteForReview, projectCopyWriteAttend, projectCopyWritingCancel, projectCopyWritingCompleted, duplicateCopyWritingProject }
