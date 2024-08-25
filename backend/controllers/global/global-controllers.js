const { bucket } = require('../../google-cloud-storage/gCloudStorage')
const Projects = require('../../models/graphic-design-model')
const { v4: uniqID } = require('uuid')
const path = require('path')
const mobileAppModel = require('../../models/projects/mobile-dev/mobile-dev-model')
const graphicDesignModel = require('../../models/graphic-design-model')
const webappModel = require('../../models/projects/web-app/web-app-model')
const websiteModal = require("../../models/projects/website-model/website-model")
const copyWritingModel = require("../../models/projects/copy-writing/copy-writing-model");
const socialMediaModel = require("../../models/projects/social-media-modal/social-media-modal")
const bcrypt = require('bcrypt')
const chatHistory = require('../../models/chat/chat-history/chat-history-modal')
const User = require('../../models/UsersLogin')
const Groups = require('../../models/chat/group-chat-modal/group-chat-model')


// Controler for getting customer upload files for all projects category
const getCustomerFiles = async (req, res) => {
    const _id = req.params.id
    const category = req.params.category
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        if (category === 'mobile-app-development') {
            const mobProject = await mobileAppModel.findById(_id)
            if (mobProject) {
                let { user } = mobProject
                const prefix = `${user}/projects/${_id}/customer-upload/`
                const [files] = await bucket.getFiles({ prefix })
                let filesInfo = files?.map((file) => {
                    let obj = {}
                    obj.id = uniqID(),
                        obj.name = path.basename(file.name),
                        obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                        obj.download_link = file.metadata.mediaLink,
                        obj.type = file.metadata.contentType,
                        obj.size = file.metadata.size,
                        obj.time = file.metadata.timeCreated
                    obj.upated_time = file.metadata.updated,
                        obj.folder_name = prefix
                    obj.folder_dir = "customer-upload"
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files Found', filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
        else if (category === 'web-app') {
            const webProject = await webappModel.findById(_id)
            if (webProject) {
                let { user } = webProject
                const prefix = `${user}/projects/${_id}/customer-upload/`
                const [files] = await bucket.getFiles({ prefix })
                let filesInfo = files?.map((file) => {
                    let obj = {}
                    obj.id = uniqID(),
                        obj.name = path.basename(file.name),
                        obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                        obj.download_link = file.metadata.mediaLink,
                        obj.type = file.metadata.contentType,
                        obj.size = file.metadata.size,
                        obj.time = file.metadata.timeCreated
                    obj.upated_time = file.metadata.updated,
                        obj.folder_name = prefix
                    obj.folder_dir = 'customer-upload'
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files Found', filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
        else if (category === 'social-media-manager') {
            const socialMediaProject = await socialMediaModel.findById(_id)
            if (socialMediaProject) {
                let { user } = socialMediaProject
                const prefix = `${user}/projects/${_id}/customer-upload/`
                const [files] = await bucket.getFiles({ prefix })
                let filesInfo = files?.map((file) => {
                    let obj = {}
                    obj.id = uniqID(),
                        obj.name = path.basename(file.name),
                        obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                        obj.download_link = file.metadata.mediaLink,
                        obj.type = file.metadata.contentType,
                        obj.size = file.metadata.size,
                        obj.time = file.metadata.timeCreated
                    obj.upated_time = file.metadata.updated,
                        obj.folder_name = prefix
                    obj.folder_dir = 'customer-upload'
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files Found', filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
        else if (category === 'copy-writing') {
            const copyWriter = await copyWritingModel.findById(_id)
            if (copyWriter) {
                let { user } = copyWriter
                const prefix = `${user}/projects/${_id}/customer-upload/`
                const [files] = await bucket.getFiles({ prefix })
                let filesInfo = files?.map((file) => {
                    let obj = {}
                    obj.id = uniqID(),
                        obj.name = path.basename(file.name),
                        obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                        obj.download_link = file.metadata.mediaLink,
                        obj.type = file.metadata.contentType,
                        obj.size = file.metadata.size,
                        obj.time = file.metadata.timeCreated
                    obj.upated_time = file.metadata.updated,
                        obj.folder_name = prefix
                    obj.folder_dir = 'customer-upload'
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files Found', filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
        else if (category === 'website-development') {
            const websoteDevlopment = await websiteModal.findById(_id)
            if (websoteDevlopment) {
                let { user } = websoteDevlopment
                const prefix = `${user}/projects/${_id}/customer-upload/`
                const [files] = await bucket.getFiles({ prefix })
                let filesInfo = files?.map((file) => {
                    let obj = {}
                    obj.id = uniqID(),
                        obj.name = path.basename(file.name),
                        obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                        obj.download_link = file.metadata.mediaLink,
                        obj.type = file.metadata.contentType,
                        obj.size = file.metadata.size,
                        obj.time = file.metadata.timeCreated
                    obj.upated_time = file.metadata.updated,
                        obj.folder_name = prefix
                    obj.folder_dir = 'customer-upload'
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files Found', filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
        else if (category === 'Graphic Design' || category === 'graphic-design') {
            const currentProject = await Projects.findById(_id)
            if (currentProject) {
                let { user } = currentProject
                const prefix = `${user}/projects/${_id}/customer-upload/`
                const [files] = await bucket.getFiles({ prefix })
                let filesInfo = files?.map((file) => {
                    let obj = {}
                    obj.id = uniqID(),
                        obj.name = path.basename(file.name),
                        obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                        obj.download_link = file.metadata.mediaLink,
                        obj.type = file.metadata.contentType,
                        obj.size = file.metadata.size,
                        obj.time = file.metadata.timeCreated
                    obj.upated_time = file.metadata.updated,
                        obj.folder_name = prefix
                    obj.folder_dir = 'customer-upload'
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files Found', filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const updateDriveLink = async (req, res) => {
    const id = req.body.id
    const category = req.body.category
    const drive_link = req.body.drive_link
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        if (category === 'mobile-app-development') {
            const mobileProject = await mobileAppModel.findById(id)
            if (mobileProject) {
                const updatingStatus = await mobileAppModel.findByIdAndUpdate(id, { drive_link })
                if (updatingStatus) {
                    const link = await mobileAppModel.findById(id)
                    return res.status(201).send({ message: 'Drive Link Updated', drive_link: link.drive_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Drive Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'web-app') {
            const webProject = await webappModel.findById(id)
            if (webProject) {
                const updatingStatus = await webappModel.findByIdAndUpdate(id, { drive_link })
                if (updatingStatus) {
                    const link = await webappModel.findById(id)
                    return res.status(201).send({ message: 'Drive Link Updated', drive_link: link.drive_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Drive Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'social-media-manager') {
            const socialMediaManager = await socialMediaModel.findById(id)
            if (socialMediaManager) {
                const updatingStatus = await socialMediaModel.findByIdAndUpdate(id, { drive_link })
                if (updatingStatus) {
                    const link = await socialMediaModel.findById(id)
                    return res.status(201).send({ message: 'Drive Link Updated', drive_link: link.drive_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Drive Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'copy-writing') {
            const copyWriting = await copyWritingModel.findById(id)
            if (copyWriting) {
                const updatingStatus = await copyWritingModel.findByIdAndUpdate(id, { drive_link })
                if (updatingStatus) {
                    const link = await copyWritingModel.findById(id)
                    return res.status(201).send({ message: 'Drive Link Updated', drive_link: link.drive_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Drive Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'website-development') {
            const websiteDevlopment = await WebsiteModal.findById(id)
            if (websiteDevlopment) {
                const updatingStatus = await WebsiteModal.findByIdAndUpdate(id, { drive_link })
                if (updatingStatus) {
                    const link = await WebsiteModal.findById(id)
                    return res.status(201).send({ message: 'Drive Link Updated', drive_link: link.drive_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Drive Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'Graphic Design' || category === 'graphic-design') {
            const graphicDesign = await Projects.findById(id)
            if (graphicDesign) {
                const updatingStatus = await Projects.findByIdAndUpdate(id, { drive_link })
                if (updatingStatus) {
                    const link = await Projects.findById(id)
                    return res.status(201).send({ message: 'Drive Link Updated', drive_link: link.drive_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Drive Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const updateFigmaLink = async (req, res) => {
    const category = req.body.category
    const id = req.body.id
    const figma_link = req.body.figma_link
    if (!id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        if (category === 'mobile-app-development') {
            const mobileProject = await mobileAppModel.findById(id)
            if (mobileProject) {
                const updatingStatus = await mobileAppModel.findByIdAndUpdate(id, { figma_link })
                if (updatingStatus) {
                    const link = await mobileAppModel.findById(id)
                    return res.status(201).send({ message: 'Figma Link Updated', figma_link: link.figma_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Figma Link' })
                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'web-app') {
            const webProject = await webappModel.findById(id)
            if (webProject) {
                const updatingStatus = await webappModel.findByIdAndUpdate(id, { figma_link })
                if (updatingStatus) {
                    const link = await webappModel.findById(id)
                    return res.status(201).send({ message: 'Figma Link Updated', figma_link: link.figma_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Figma Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'social-media-manager') {
            const socialMediaManager = await socialMediaModel.findById(id)
            if (socialMediaManager) {
                const updatingStatus = await socialMediaModel.findByIdAndUpdate(id, { figma_link })
                if (updatingStatus) {
                    const link = await socialMediaModel.findById(id)
                    return res.status(201).send({ message: 'Figma Link Updated', figma_link: link.figma_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Figma Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'copy-writing') {
            const copyWriting = await copyWritingModel.findById(id)
            if (copyWriting) {
                const updatingStatus = await copyWritingModel.findByIdAndUpdate(id, { figma_link })
                if (updatingStatus) {
                    const link = await copyWritingModel.findById(id)
                    return res.status(201).send({ message: 'Figma Link Updated', figma_link: link.figma_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Figma Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'website-development') {
            const websiteDevlopment = await WebsiteModal.findById(id)
            if (websiteDevlopment) {
                const updatingStatus = await WebsiteModal.findByIdAndUpdate(id, { figma_link })
                if (updatingStatus) {
                    const link = await WebsiteModal.findById(id)
                    return res.status(201).send({ message: 'Figma Link Updated', figma_link: link.figma_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Figma Link' })

                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
        else if (category === 'Graphic Design' || category === 'graphic-design') {
            const graphicDesign = await Projects.findById(id)
            if (graphicDesign) {
                const updatingStatus = await Projects.findByIdAndUpdate(id, { figma_link })
                if (updatingStatus) {
                    const link = await Projects.findById(id)
                    return res.status(201).send({ message: 'Figma Link Updated', figma_link: link.figma_link })
                }
                else {
                    return res.status(400).send({ message: 'Found error while Updating Figma Link' })
                }
            } else {
                return res.status(404).send({ messsage: 'Project Not Found' })
            }
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const getSingleProject = async (req, res) => {
    const _id = req.params.id
    const category = req.params.category
    if (!_id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    try {
        if (category === 'mobile-app-development') {
            const mobileProject = await mobileAppModel.findById(_id)
            if (mobileProject) {
                return res.status(200).json({ message: "Project Found", project: mobileProject })
            } else {
                return res.status(404).json({ message: "Project Not Found" })
            }
        }
        else if (category === 'web-app') {
            const webApp = await webappModel.findById(_id)
            if (webApp) {
                return res.status(200).json({ message: "Project Found", project: webApp })
            } else {
                return res.status(404).json({ message: "Project Not Found" })
            }
        }
        else if (category === 'social-media-manager') {
            const socialMediaManager = await socialMediaModel.findById(_id)
            if (socialMediaManager) {
                return res.status(200).json({ message: "Project Found", project: socialMediaManager })
            } else {
                return res.status(404).json({ message: "Project Not Found" })
            }
        }
        else if (category === 'copy-writing') {
            const copyWriter = await copyWritingModel.findById(_id)
            if (copyWriter) {
                return res.status(200).json({ message: "Project Found", project: copyWriter })
            } else {
                return res.status(404).json({ message: "Project Not Found" })
            }
        }
        else if (category === 'website-development') {
            const websiteDevlopment = await websiteModal.findById(_id)
            if (websiteDevlopment) {
                return res.status(200).json({ message: "Project Found", project: websiteDevlopment })
            } else {
                return res.status(404).json({ message: "Project Not Found" })
            }
        }
        else if (category === 'Graphic Design' || category === 'graphic-design') {
            console.log('working')
            const findProject = await graphicDesignModel.findById(_id)
            if (findProject) {
                return res.status(200).json({ message: "Project Found", project: findProject })
            } else {
                return res.status(404).json({ message: "Project Not Found" })
            }
        }
    } catch (err) {
        console.log('500')
        res.status(500).send({ message: "Internal Server Error" })
    }
}
const designerUploadsOnVersion = async (req, res) => {
    const files = req.files
    const _id = req.params.id
    const versionNo = req.params.version
    const category = req.params.category
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        if (category === 'mobile-app-development') {
            const mobileProject = await mobileAppModel.findById(_id)
            if (mobileProject) {
                let { user, project_title } = mobileProject
                const prefix = `${user}/projects/${_id}/version-${versionNo}/`
                await Promise.all(files?.map(file => {
                    const options = {
                        resumable: false,
                    }
                    const blob = bucket.file(prefix + file.originalname)
                    blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
                }))
                    .then(async () => {
                        if (mobileProject?.version?.length > 0) {
                            const isCheck = mobileProject.version?.includes(versionNo)
                            if (!isCheck) {
                                const versions = mobileProject.version
                                mobileProject.version = [...versions, versionNo]
                                const save = await mobileProject.save()
                                if (save) {
                                    // const project_creator = await User.findById({ _id: user })
                                    // if (project_creator && project_creator?.email) {
                                    //     const msg = `Designer uploded file in project ${project_title}`
                                    //     await designerUploadFilesMail(project_title, project_creator.email, msg)
                                    // }

                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                            else {
                                const project_creator = await User.findById({ _id: user })
                                if (project_creator && project_creator?.email) {
                                    const msg = `Designer uploded file in project ${project_title}`
                                    // await designerUploadFilesMail(project_title, project_creator.email, msg)
                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                        } else {
                            const project_creator = await User.findById({ _id: user })
                            if (project_creator && project_creator?.email) {
                                const msg = `Designer uploded file in project ${project_title}`
                                // await designerUploadFilesMail(project_title, project_creator.email, msg)
                            }
                            mobileProject.version = [versionNo]
                            await mobileProject.save()
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        }
                    })
            }
        }
        else if (category === 'web-app') {
            const webProject = await webappModel.findById(_id)
            if (webProject) {
                let { user, project_title } = webProject
                const prefix = `${user}/projects/${_id}/version-${versionNo}/`
                await Promise.all(files?.map(file => {
                    const options = {
                        resumable: false,
                    }
                    const blob = bucket.file(prefix + file.originalname)
                    blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
                }))
                    .then(async () => {
                        if (webProject?.version?.length > 0) {
                            const isCheck = webProject.version?.includes(versionNo)
                            if (!isCheck) {
                                const versions = webProject.version
                                webProject.version = [...versions, versionNo]
                                const save = await webProject.save()
                                if (save) {
                                    // const project_creator = await User.findById({ _id: user })
                                    // if (project_creator && project_creator?.email) {
                                    //     const msg = `Designer uploded file in project ${project_title}`
                                    //     await designerUploadFilesMail(project_title, project_creator.email, msg)
                                    // }

                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                            else {
                                const project_creator = await User.findById({ _id: user })
                                if (project_creator && project_creator?.email) {
                                    const msg = `Designer uploded file in project ${project_title}`
                                    // await designerUploadFilesMail(project_title, project_creator.email, msg)
                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                        } else {
                            const project_creator = await User.findById({ _id: user })
                            if (project_creator && project_creator?.email) {
                                const msg = `Designer uploded file in project ${project_title}`
                                // await designerUploadFilesMail(project_title, project_creator.email, msg)
                            }
                            webProject.version = [versionNo]
                            await webProject.save()
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        }
                    })
            }
        }
        else if (category === 'social-media-manager') {
            const socialMediaManager = await socialMediaModel.findById(_id)
            if (socialMediaManager) {
                let { user, project_title } = socialMediaManager
                const prefix = `${user}/projects/${_id}/version-${versionNo}/`
                await Promise.all(files?.map(file => {
                    const options = {
                        resumable: false,
                    }
                    const blob = bucket.file(prefix + file.originalname)
                    blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
                }))
                    .then(async () => {
                        if (socialMediaManager?.version?.length > 0) {
                            const isCheck = socialMediaManager.version?.includes(versionNo)
                            if (!isCheck) {
                                const versions = socialMediaManager.version
                                socialMediaManager.version = [...versions, versionNo]
                                const save = await socialMediaManager.save()
                                if (save) {
                                    // const project_creator = await User.findById({ _id: user })
                                    // if (project_creator && project_creator?.email) {
                                    //     const msg = `Designer uploded file in project ${project_title}`
                                    //     await designerUploadFilesMail(project_title, project_creator.email, msg)
                                    // }

                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                            else {
                                const project_creator = await User.findById({ _id: user })
                                if (project_creator && project_creator?.email) {
                                    const msg = `Designer uploded file in project ${project_title}`
                                    // await designerUploadFilesMail(project_title, project_creator.email, msg)
                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                        } else {
                            const project_creator = await User.findById({ _id: user })
                            if (project_creator && project_creator?.email) {
                                const msg = `Designer uploded file in project ${project_title}`
                                // await designerUploadFilesMail(project_title, project_creator.email, msg)
                            }
                            socialMediaManager.version = [versionNo]
                            await socialMediaManager.save()
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        }
                    })
            }
        }
        else if (category === 'copy-writing') {
            const copyWriting = await copyWritingModel.findById(_id)
            if (copyWriting) {
                let { user, project_title } = copyWriting
                const prefix = `${user}/projects/${_id}/version-${versionNo}/`
                await Promise.all(files?.map(file => {
                    const options = {
                        resumable: false,
                    }
                    const blob = bucket.file(prefix + file.originalname)
                    blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
                }))
                    .then(async () => {
                        if (copyWriting?.version?.length > 0) {
                            const isCheck = copyWriting.version?.includes(versionNo)
                            if (!isCheck) {
                                const versions = copyWriting.version
                                copyWriting.version = [...versions, versionNo]
                                const save = await copyWriting.save()
                                if (save) {
                                    // const project_creator = await User.findById({ _id: user })
                                    // if (project_creator && project_creator?.email) {
                                    //     const msg = `Designer uploded file in project ${project_title}`
                                    //     await designerUploadFilesMail(project_title, project_creator.email, msg)
                                    // }

                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                            else {
                                const project_creator = await User.findById({ _id: user })
                                if (project_creator && project_creator?.email) {
                                    const msg = `Designer uploded file in project ${project_title}`
                                    // await designerUploadFilesMail(project_title, project_creator.email, msg)
                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                        } else {
                            const project_creator = await User.findById({ _id: user })
                            if (project_creator && project_creator?.email) {
                                const msg = `Designer uploded file in project ${project_title}`
                                // await designerUploadFilesMail(project_title, project_creator.email, msg)
                            }
                            copyWriting.version = [versionNo]
                            await copyWriting.save()
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        }
                    })
            }
        }
        else if (category === 'website-development') {
            const websiteDevlopment = await websiteModal.findById(_id)
            if (websiteDevlopment) {
                let { user, project_title } = websiteDevlopment
                const prefix = `${user}/projects/${_id}/version-${versionNo}/`
                await Promise.all(files?.map(file => {
                    const options = {
                        resumable: false,
                    }
                    const blob = bucket.file(prefix + file.originalname)
                    blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
                }))
                    .then(async () => {
                        if (websiteDevlopment?.version?.length > 0) {
                            const isCheck = websiteDevlopment.version?.includes(versionNo)
                            if (!isCheck) {
                                const versions = websiteDevlopment.version
                                websiteDevlopment.version = [...versions, versionNo]
                                const save = await websiteDevlopment.save()
                                if (save) {
                                    // const project_creator = await User.findById({ _id: user })
                                    // if (project_creator && project_creator?.email) {
                                    //     const msg = `Designer uploded file in project ${project_title}`
                                    //     await designerUploadFilesMail(project_title, project_creator.email, msg)
                                    // }

                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                            else {
                                const project_creator = await User.findById({ _id: user })
                                if (project_creator && project_creator?.email) {
                                    const msg = `Designer uploded file in project ${project_title}`
                                    // await designerUploadFilesMail(project_title, project_creator.email, msg)
                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                        } else {
                            const project_creator = await User.findById({ _id: user })
                            if (project_creator && project_creator?.email) {
                                const msg = `Designer uploded file in project ${project_title}`
                                // await designerUploadFilesMail(project_title, project_creator.email, msg)
                            }
                            websiteDevlopment.version = [versionNo]
                            await websiteDevlopment.save()
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        }
                    })
            }
        }
        else if (category === 'Graphic Design' || category === 'graphic-design') {
            const currentProject = await Projects.findById(_id)
            if (currentProject) {
                let { user, project_title } = currentProject
                const prefix = `${user}/projects/${_id}/version-${versionNo}/`
                await Promise.all(files?.map(file => {
                    const options = {
                        resumable: false,
                    }
                    const blob = bucket.file(prefix + file.originalname)
                    blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
                }))
                    .then(async () => {
                        if (currentProject?.version?.length > 0) {
                            const isCheck = currentProject.version?.includes(versionNo)
                            if (!isCheck) {
                                const versions = currentProject.version
                                currentProject.version = [...versions, versionNo]
                                const save = await currentProject.save()
                                if (save) {
                                    // const project_creator = await User.findById({ _id: user })
                                    // if (project_creator && project_creator?.email) {
                                    //     const msg = `Designer uploded file in project ${project_title}`
                                    //     await designerUploadFilesMail(project_title, project_creator.email, msg)
                                    // }

                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                            else {
                                const project_creator = await User.findById({ _id: user })
                                if (project_creator && project_creator?.email) {
                                    const msg = `Designer uploded file in project ${project_title}`
                                    // await designerUploadFilesMail(project_title, project_creator.email, msg)
                                }
                                return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                            }
                        } else {
                            const project_creator = await User.findById({ _id: user })
                            if (project_creator && project_creator?.email) {
                                const msg = `Designer uploded file in project ${project_title}`
                                // await designerUploadFilesMail(project_title, project_creator.email, msg)
                            }
                            currentProject.version = [versionNo]
                            await currentProject.save()
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        }
                    })
            }
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
let generationMatchPreCondition = 0
const uploadFile = async (req, res) => {
    let { user_id, project_id } = req.body
    console.log('user_id=> ', user_id, project_id)
    const prefix = `${user_id}/projects/${project_id}/customer-upload/`
    await Promise.all(req.files.map(file => {
        const options = {
            resumable: false,
            preconditionOpts: {
                ifGenerationMatch: generationMatchPreCondition
            },
            // public : true
        }
        const blob = bucket.file(prefix + file.originalname)
        blob.createWriteStream(options).on('error', (err) => console.log('err=> ', err))
            .on('finish', async () => {
                // console.log('files uploaded')
                // await bucket.file(file.originalname).makePublic()
            }).end(file.buffer)
    }))
        .then(() => {
            res.status(201).send({ message: 'files uploaded' })
        })
        .catch((err) => {
            res.status(500).send({ message: 'Internal Server error' })
            // console.log('resp =>', err)
        })
}
const getFiles = async (req, res) => {
    let { user_id, project_id } = req.body
    const prefix = `${user_id}/projects/${project_id}/customer-upload/`
    try {
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
            obj.folder_dir = "Customer"
            return obj
        })
        if (filesInfo.length > 0) {
            return res.status(201).send({ message: 'Project Created Successfully' })
        }
        // const findProject = await graphicProjectsModel.findById({ _id: project_id }).exec()
        // if (findProject) {
        //     findProject.add_files = [{ version1: filesInfo }]
        //     findProject.save()
        //     return res.status(201).send({ message: 'Project Created Successfully' })
        // } else {
        //     return res.status(404).send({ message: 'Project not found' })
        // }
    } catch (err) {
        return res.status(500).send({ message: 'Internal Server error' })
    }
}
const deleteTeamMember = async (req, res) => {
    const category = req.params.category
    const { user, project_id } = req.body
    if (!project_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        if (category === 'mobile-app-development') {
            const userAccount = await User.findById(user)
            if (userAccount) {
                const findProject = await mobileAppModel.findById(project_id)
                const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
                findProject.team_members = filterTeamMembers
                findProject.status = 'Project manager'
                findProject.is_active = false
                await findProject.save()
                return res.status(200).send({ message: "Team member removed" })
            } else {
                return res.status(404).send({ message: "Team member Not Found" })
            }
        }
        else if (category === 'web-app') {
            const userAccount = await User.findById(user)
            if (userAccount) {
                const findProject = await webappModel.findById(project_id)
                const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
                findProject.team_members = filterTeamMembers
                findProject.status = 'Project manager'
                findProject.is_active = false
                await findProject.save()
                return res.status(200).send({ message: "Team member removed" })
            } else {
                return res.status(404).send({ message: "Team member Not Found" })
            }
        }
        else if (category === 'social-media-manager') {
            const userAccount = await User.findById(user)
            if (userAccount) {
                const findProject = await socialMediaModel.findById(project_id)
                const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
                findProject.team_members = filterTeamMembers
                findProject.status = 'Project manager'
                findProject.is_active = false
                await findProject.save()
                return res.status(200).send({ message: "Team member removed" })
            } else {
                return res.status(404).send({ message: "Team member Not Found" })
            }
        }
        else if (category === 'copy-writing') {
            const userAccount = await User.findById(user)
            if (userAccount) {
                const findProject = await copyWritingModel.findById(project_id)
                const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
                findProject.team_members = filterTeamMembers
                findProject.status = 'Project manager'
                findProject.is_active = false
                await findProject.save()
                return res.status(200).send({ message: "Team member removed" })
            } else {
                return res.status(404).send({ message: "Team member Not Found" })
            }
        }
        else if (category === 'website-development') {
            const userAccount = await User.findById(user)
            if (userAccount) {
                const findProject = await websiteModal.findById(project_id)
                const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
                findProject.team_members = filterTeamMembers
                findProject.status = 'Project manager'
                findProject.is_active = false
                await findProject.save()
                return res.status(200).send({ message: "Team member removed" })
            } else {
                return res.status(404).send({ message: "Team member Not Found" })
            }
        }
        else if (category === 'Graphic Design' || category === 'graphic-design') {
            const userAccount = await User.findById(user)
            if (userAccount) {
                const findProject = await Projects.findById(project_id)
                const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
                findProject.team_members = filterTeamMembers
                findProject.status = 'Project manager'
                findProject.is_active = false
                await findProject.save()
                return res.status(200).send({ message: "Team member removed" })
            } else {
                return res.status(404).send({ message: "Team member Not Found" })
            }
        }
    } catch (err) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const updateProject = async (req, res) => {
    const { project_id, project_data, category } = req.body
    if (!project_id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    const { team_members, is_active, status } = project_data
    try {
        if (category === 'mobile-app-development') {
            const mobProject = await mobileAppModel.findById(project_id)
            if (mobProject) {
                if (mobProject.team_members.length > 0) {
                    // mobProject.team_members = [...mobProject.team_members, ...team_members]
                    return res.status(201).send({ message: 'Already Assigned to Designer', })
                } else {
                    mobProject.team_members = team_members
                    mobProject.status = status
                    mobProject.is_active = is_active
                    const save = await mobProject.save()
                    return res.status(201).send({ message: 'Project Updated', save })
                }
            }
        }
        else if (category === 'web-app') {
            const webAppProject = await webappModel.findById(project_id)
            if (webAppProject) {
                if (webAppProject.team_members.length > 0) {
                    // webAppProject.team_members = [...webAppProject.team_members, ...team_members]
                    return res.status(201).send({ message: 'Already Assigned to Designer', })
                } else {
                    webAppProject.team_members = team_members
                    webAppProject.status = status
                    webAppProject.is_active = is_active
                    const save = await webAppProject.save()
                    return res.status(201).send({ message: 'Project Updated', save })
                }
            }
        }
        else if (category === 'social-media-manager') {
            const socialMediaManager = await socialMediaModel.findById(project_id)
            if (socialMediaManager) {
                if (socialMediaManager.team_members.length > 0) {
                    // socialMediaManager.team_members = [...socialMediaManager.team_members, ...team_members]
                    return res.status(201).send({ message: 'Already Assigned to Designer', })
                } else {
                    socialMediaManager.team_members = team_members
                    socialMediaManager.status = status
                    socialMediaManager.is_active = is_active
                    const save = await socialMediaManager.save()
                    return res.status(201).send({ message: 'Project Updated', save })
                }
            }
        }
        else if (category === 'copy-writing') {
            const copyWriter = await copyWritingModel.findById(project_id)
            if (copyWriter) {
                if (copyWriter.team_members.length > 0) {
                    // copyWriter.team_members = [...copyWriter.team_members, ...team_members]
                    return res.status(201).send({ message: 'Already Assigned to Designer', })
                } else {
                    copyWriter.team_members = team_members
                    copyWriter.status = status
                    copyWriter.is_active = is_active
                    const save = await copyWriter.save()
                    return res.status(201).send({ message: 'Project Updated', save })
                }
            }
        }
        else if (category === 'website-development') {
            const websiteDevlopment = await websiteModal.findById(project_id)
            if (websiteDevlopment) {
                if (websiteDevlopment.team_members.length > 0) {
                    // websiteDevlopment.team_members = [...websiteDevlopment.team_members, ...team_members]
                    return res.status(201).send({ message: 'Already Assigned to Designer', })
                } else {
                    websiteDevlopment.team_members = team_members
                    websiteDevlopment.status = status
                    websiteDevlopment.is_active = is_active
                    const save = await websiteDevlopment.save()
                    return res.status(201).send({ message: 'Project Updated', save })
                }
            }
        }
        else if (category === 'graphic-design') {
            const graphicDesign = await graphicDesignModel.findById(project_id)
            if (graphicDesign) {
                if (graphicDesign.team_members.length > 0) {
                    return res.status(201).send({ message: 'Already Assigned to Designer', })
                } else {
                    graphicDesign.team_members = team_members
                    graphicDesign.status = status
                    graphicDesign.is_active = is_active
                    const save = await graphicDesign.save()
                    return res.status(201).send({ message: 'Project Updated', save })
                }
            }
        }
    } catch (err) {
        res.status(500).send({ message: 'Internal Server error' })
    }

}
const createMemberAccounts = async (req, res) => {
    const { username, roles, password, email } = req.body
    if (!username || !roles || !password || !email) {
        return res.status(402).send({ message: 'Please provide all req fields' })
    }
    try {
        const duplicate = await User.findOne({ email }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Email already exists' })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        if (hashPassword) {
            const obj = { name: username, is_active: true, roles, 'password': hashPassword, verified: true, email, avatar: '', notifications: [] }
            const user = await User.create(obj)
            if (user !== null) {
                const allUsers = await User.find({ _id: { $nin: [user._id] } }).lean()
                const filterUser = allUsers.filter(user => {
                    if (user.roles.includes('Mobile-App-Developer')) return user
                    if (user.roles.includes('Graphic-Designer')) return user
                    if (user.roles.includes('Copy-Writer')) return user
                    if (user.roles.includes('Social-Media-Manager')) return user
                    if (user.roles.includes('Project-Manager')) return user
                    if (user.roles.includes('Web-Developer')) return user
                }).map(user => {
                    return String(user._id)
                })
                let allUserArrayObject = []
                for (const item_ of filterUser) {
                    const hg = {
                        user_id: item_,
                        unread_messages_count: 0,
                        unread_messages_ids: []
                    }
                    allUserArrayObject.push(hg)
                }
                const save = await chatHistory.create({ userId: user._id, chated_persons: allUserArrayObject })
                if (save) {
                    let findAllChatHistory = await chatHistory.find()
                    findAllChatHistory = findAllChatHistory.filter(item => item.userId.toString() !== save.userId.toString())
                    for (const item of findAllChatHistory) {
                        const findCurrentHistory = await chatHistory.findOne(item._id)
                        if (findCurrentHistory.chated_persons.length > 0) {
                            console.log('working one')
                            const all_users = findCurrentHistory.chated_persons
                            const findUserExist = all_users.some(item => item.user_id.toString() === user._id.toString())
                            if (!findUserExist) {
                                console.log('working two')
                                findCurrentHistory.chated_persons = [...all_users, {
                                    user_id: user._id,
                                    unread_messages_count: 0,
                                    unread_messages_ids: []
                                }]
                                await findCurrentHistory.save()
                            }
                        }
                    }
                    return res.status(201).send({ message: 'User Created' })
                } else {
                    await User.findByIdAndRemove(user._id)
                    return res.status(404).send({ message: 'Failed to create user' })
                }
            } else {
                return res.status(404).send({ message: 'Failed to create user try again!' })
            }
        } else {
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" });
    }
}
const updateProjectPriority = async (req, res) => {
    const { project_id, priority, category } = req.body
    try {
        if (category === 'mobile-app-development') {
            const mobProject = await mobileAppModel.findById(project_id)
            if (mobProject) {
                mobProject.priority = priority
                const project = await mobProject.save()
                return res.status(201).send({ message: 'Project Updated', project })
            } else {
                return res.status(404).send({ message: 'Project not found' })
            }
        }
        else if (category === 'web-app') {
            const webAppProject = await webappModel.findById(project_id)
            if (webAppProject) {
                webAppProject.priority = priority
                const project = await webAppProject.save()
                return res.status(201).send({ message: 'Project Updated', project })
            } else {
                return res.status(404).send({ message: 'Project not found' })
            }
        }
        else if (category === 'social-media-manager') {
            const socialMediaManager = await socialMediaModel.findById(project_id)
            if (socialMediaManager) {
                socialMediaManager.priority = priority
                const project = await socialMediaManager.save()
                return res.status(201).send({ message: 'Project Updated', project })
            } else {
                return res.status(404).send({ message: 'Project not found' })
            }
        }
        else if (category === 'copy-writing') {
            const copyWriter = await copyWritingModel.findById(project_id)
            if (copyWriter) {
                copyWriter.priority = priority
                const project = await copyWriter.save()
                return res.status(201).send({ message: 'Project Updated', project })
            } else {
                return res.status(404).send({ message: 'Project not found' })
            }
        }
        else if (category === 'website-development') {
            const websiteDevlopment = await websiteModal.findById(project_id)
            if (websiteDevlopment) {
                websiteDevlopment.priority = priority
                const project = await websiteDevlopment.save()
                return res.status(201).send({ message: 'Project Updated', project })
            } else {
                return res.status(404).send({ message: 'Project not found' })
            }
        }
        else if (category === 'Graphic Design' || category === 'graphic-design') {
            const currentProject = await Projects.findById(project_id)
            if (currentProject) {
                currentProject.priority = priority
                const project = await currentProject.save()
                return res.status(201).send({ message: 'Project Updated', project })
            } else {
                return res.status(404).send({ message: 'Project not found' })
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const updatingAllUsersChatHisotries = async () => {
    const allUsers = await User.find().lean()
    const filterUser = allUsers.filter(user => {
        if (user.roles.includes('Mobile-App-Developer')) return user
        if (user.roles.includes('Graphic-Designer')) return user
        if (user.roles.includes('Copy-Writer')) return user
        if (user.roles.includes('Social-Media-Manager')) return user
        if (user.roles.includes('Project-Manager')) return user
        if (user.roles.includes('Web-Developer')) return user
    }).map(user => {
        return String(user._id)
    })
    for (let i = 0; i < filterUser.length; i++) {
        const user = filterUser[i]
        const history = await chatHistory.findOne({ userId: user }).exec()
        if (history) {
            let arr = filterUser.filter(item => item !== user)
            let cc = []
            for (let a = 0; a < arr.length; a++) {
                const cu = arr[a]
                const h = {
                    user_id: cu,
                    unread_messages_count: 0,
                    unread_messages_ids: []
                }
                cc.push(h)
            }
            await chatHistory.findByIdAndUpdate(history._id, { chated_persons: cc })
        }

    }
}
const addingGroupalsoToChatHistory = async () => {
    try {
        const allgroups = await Groups.find().lean()
        for (let k = 0; k < allgroups.length; k++) {
            const group_id = allgroups[k]._id
            const participant = allgroups[k].participant
            for (let p = 0; p < participant.length; p++) {
                const _id = participant[p]
                const chat_history = await chatHistory.findOne({ userId: _id })
                if (chat_history) {
                    chat_history.chated_persons.push({ user_id: group_id, unread_messages_count: 0, unread_messages_ids: [] })
                    await chat_history.save()
                }

            }

        }
    }
    catch (err) {
        console.log(err)
    }
}
const creatingChatHistory = async () => {
    try {
        const allUsers = await User.find().lean()
        const filterUser = allUsers.filter(user => {
            if (user.roles.includes('Mobile-App-Developer')) return user
            if (user.roles.includes('Graphic-Designer')) return user
            if (user.roles.includes('Copy-Writer')) return user
            if (user.roles.includes('Social-Media-Manager')) return user
            if (user.roles.includes('Project-Manager')) return user
            if (user.roles.includes('Web-Developer')) return user
        }).map(user => {
            return String(user._id)
        })
        for (let i = 0; i < filterUser.length; i++) {
            const user = filterUser[i]
            await chatHistory.create({
                userId: user,
                chated_persons: []
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = { getCustomerFiles, updateDriveLink, updateFigmaLink, updateProject, getSingleProject, designerUploadsOnVersion, uploadFile, getFiles, deleteTeamMember, createMemberAccounts, updateProjectPriority, updatingAllUsersChatHisotries, addingGroupalsoToChatHistory, creatingChatHistory }