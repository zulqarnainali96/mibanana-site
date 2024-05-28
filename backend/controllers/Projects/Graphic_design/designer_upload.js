const User = require('../../../models/UsersLogin')
const Projects = require('../../../models/graphic-design-model')
const { bucket } = require('../../../google-cloud-storage/gCloudStorage')
const { v4: uniqID } = require('uuid')
const path = require('path')
const { designerUploadFilesMail } = require('../../../utils/sendMail')
const mobileAppModel = require('../../../models/projects/mobile-dev/mobile-dev-model')
const webappModel = require('../../../models/projects/web-app/web-app-model')
const WebsiteModal = require("../../../models/projects/website-model/website-model")
const copyWritingModel = require("../../../models/projects/copy-writing/copy-writing-model");
const socialMediaModel = require("../../../models/projects/social-media-modal/social-media-modal")

const designerUpload = async (req, res) => {
    const files = req.files
    const _id = req.params.id
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    if (!files) {
        return res.status(400).send({ message: 'Files not found' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            const prefix = `${name}-${user}/${project_title}-${_id}/designer_uploads/`
            await Promise.all(files?.map(file => {
                const options = {
                    resumable: false,
                }
                const blob = bucket.file(prefix + file.originalname)
                blob.createWriteStream(options).on('error', (err) => { throw err }).on('finish',
                    async () => { }).end(file.buffer)
            }))
                .then(() => {
                    // console.log(currentProject)
                    res.status(201).send({ message: 'files uploaded' })

                })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const getDesignerFiles = async (req, res) => {
    const _id = req.params.id

    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            const prefix = `${name}-${user}/${project_title}-${_id}/designer_uploads/`
            const [files] = await bucket.getFiles({ prefix })
            let filesInfo = files?.map((file) => {
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
                obj.folder_dir = "Designer"
                return obj
            })
            if (filesInfo.length > 0) {
                return res.status(200).send({ message: 'Files fount', filesInfo })
            }
            if (filesInfo.length === 0 && files.length === 0) {
                return res.status(404).send({ message: 'No Files Found' })
            }
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
// const designerUploadsOnVersion = async (req, res) => {
//     const files = req.files
//     const _id = req.params.id
//     const versionNo = req.params.version
//     const category = req.params.category
//     if (!_id) {
//         return res.status(400).send({ message: 'ID not found' })
//     }
//     try {
//         if(category === 'mobile-app-development'){
//             const mobileProject = await Projects.findById(_id)
//         if (mobileProject) {
//             let { user, project_title } = mobileProject
//             const prefix = `${user}/projects/${_id}/version-${versionNo}/`
//             await Promise.all(files?.map(file => {
//                 const options = {
//                     resumable: false,
//                 }
//                 const blob = bucket.file(prefix + file.originalname)
//                 blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
//             }))
//                 .then(async () => {
//                     if (mobileProject?.version?.length > 0) {
//                         const isCheck = mobileProject.version?.includes(versionNo)
//                         if (!isCheck) {
//                             const versions = mobileProject.version
//                             mobileProject.version = [...versions, versionNo]
//                             const save = await mobileProject.save()
//                             if (save) {
//                                 // const project_creator = await User.findById({ _id: user })
//                                 // if (project_creator && project_creator?.email) {
//                                 //     const msg = `Designer uploded file in project ${project_title}`
//                                 //     await designerUploadFilesMail(project_title, project_creator.email, msg)
//                                 // }

//                             }
//                             return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
//                         }
//                         else {
//                             const project_creator = await User.findById({ _id: user })
//                             if (project_creator && project_creator?.email) {
//                                 const msg = `Designer uploded file in project ${project_title}`
//                                 // await designerUploadFilesMail(project_title, project_creator.email, msg)
//                             }
//                             return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
//                         }
//                     } else {
//                         const project_creator = await User.findById({ _id: user })
//                         if (project_creator && project_creator?.email) {
//                             const msg = `Designer uploded file in project ${project_title}`
//                             // await designerUploadFilesMail(project_title, project_creator.email, msg)
//                         }
//                         mobileProject.version = [versionNo]
//                         await mobileProject.save()
//                         return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
//                     }
//                 })
//         }
//         }
//         else if (category === 'web-app') {

//         }
//         else if (category === 'social-media-manager') {

//         }
//         else if (category === 'copy-writing') {

//         }
//         else if (category === 'website-development') {

//         }
//         else if (category === 'Graphic Design' || category === 'graphic-design') {

//         }
//         const currentProject = await Projects.findById(_id)
//         if (currentProject) {
//             let { user, project_title } = currentProject
//             const prefix = `${user}/projects/${_id}/version-${versionNo}/`
//             await Promise.all(files?.map(file => {
//                 const options = {
//                     resumable: false,
//                 }
//                 const blob = bucket.file(prefix + file.originalname)
//                 blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
//             }))
//                 .then(async () => {
//                     if (currentProject?.version?.length > 0) {
//                         const isCheck = currentProject.version?.includes(versionNo)
//                         if (!isCheck) {
//                             const versions = currentProject.version
//                             currentProject.version = [...versions, versionNo]
//                             const save = await currentProject.save()
//                             if (save) {
//                                 // const project_creator = await User.findById({ _id: user })
//                                 // if (project_creator && project_creator?.email) {
//                                 //     const msg = `Designer uploded file in project ${project_title}`
//                                 //     await designerUploadFilesMail(project_title, project_creator.email, msg)
//                                 // }

//                             }
//                             return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
//                         }
//                         else {
//                             const project_creator = await User.findById({ _id: user })
//                             if (project_creator && project_creator?.email) {
//                                 const msg = `Designer uploded file in project ${project_title}`
//                                 // await designerUploadFilesMail(project_title, project_creator.email, msg)
//                             }
//                             return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
//                         }
//                     } else {
//                         const project_creator = await User.findById({ _id: user })
//                         if (project_creator && project_creator?.email) {
//                             const msg = `Designer uploded file in project ${project_title}`
//                             // await designerUploadFilesMail(project_title, project_creator.email, msg)
//                         }
//                         currentProject.version = [versionNo]
//                         await currentProject.save()
//                         return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
//                     }
//                 })
//         }

//     } catch (error) {
//         console.log(error.message)
//         res.status(500).send({ message: 'Internal Server error' })
//     }
// }
const getFilesOnVersionBasis = async (req, res) => {
    const _id = req.params.id
    const versionNo = req.params.version
    const category = req.params.category
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        if (category === 'mobile-app-development') {
            const mobProject = await mobileAppModel.findById(_id)
            if (mobProject) {
                let { user } = mobProject
                const prefix = `${user}/projects/${_id}/version-${versionNo}`
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
                    obj.folder_dir = "version-" + versionNo
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files found on verion ' + versionNo, filesInfo })
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
                const prefix = `${user}/projects/${_id}/version-${versionNo}`
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
                    obj.folder_dir = "version-" + versionNo
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files found on verion ' + versionNo, filesInfo })
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
                const prefix = `${user}/projects/${_id}/version-${versionNo}`
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
                    obj.folder_dir = "version-" + versionNo
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files found on verion ' + versionNo, filesInfo })
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
                const prefix = `${user}/projects/${_id}/version-${versionNo}`
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
                    obj.folder_dir = "version-" + versionNo
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files found on verion ' + versionNo, filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
        else if (category === 'website-development') {
            const websoteDevlopment = await WebsiteModal.findById(_id)
            if (websoteDevlopment) {
                let { user } = websoteDevlopment
                const prefix = `${user}/projects/${_id}/version-${versionNo}`
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
                    obj.folder_dir = "version-" + versionNo
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files found on verion ' + versionNo, filesInfo })
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
                const prefix = `${user}/projects/${_id}/version-${versionNo}`
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
                    obj.folder_dir = "version-" + versionNo
                    return obj
                })
                if (filesInfo.length > 0) {
                    return res.status(200).send({ message: 'Files found on verion ' + versionNo, filesInfo })
                }
                if (filesInfo.length === 0 && files.length === 0) {
                    return res.status(404).send({ message: 'No Files Found' })
                }
            }
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const deleteFileOnVersionBasis = async (req, res) => {
    const _id = req.params.id
    const versionNo = req.params.version
    if (!_id) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    if (!versionNo) {
        return res.status(402).send({ message: 'Version no not provided' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            const findUser = await User.findById({ _id: currentProject?.user })
            if (findUser) {
                let { project_title } = currentProject
                let { name, _id: userId } = findUser
                project_title = project_title.replace(/\s/g, '')
                name = name.replace(/\s/g, '')
                // const prefix = `${name}-${userId}/${project_title}-${_id}/version-${versionNo}/`
                // const prefix = `${userId}/${project_title}-${_id}/version-${versionNo}/`
                const prefix = `${userId}/${project_title}-${_id}/version-${versionNo}/`
                const [files] = await bucket.getFiles({ prefix })
                await Promise.all(
                    files?.map(async (file) => {
                        try {
                            await file.delete();
                            console.log(`Deleted file: ${file.name}`);
                        } catch (error) {
                            throw error
                        }
                    })
                ).then(async () => {
                    const currentProject = await Projects.findById(_id)
                    const result = currentProject?.version?.filter(item => item !== versionNo)
                    currentProject.version = result
                    const deleting = await currentProject.save()
                    if (deleting) {
                        const { version } = await Projects.findById(_id)
                        return res.status(200).send({ message: 'Version Deleted', version })
                    } else {
                        return res.status(200).send({ message: 'Failed to delete version no' })
                    }
                }).catch((err) => { throw err })
            } else {
                return res.status(400).send({ message: 'User Not Found try again!' })
            }
        } else {
            return res.status(404).send({ message: 'project Not Found' })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }

}
const deleteDesignerFiles = async (req, res) => {
    const _id = req.params.id
    const fileName = req.params.filename
    // console.log(req.params.id, req.params.filename)
    if (!_id) {
        return res.status(400).send({ message: 'ID not found try again' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            // const prefix = `${name}-${user}/${project_title}-${_id}/designer_uploads/`
            const prefix = `${user}/${project_title}-${_id}/designer_uploads/`
            const [files] = await bucket.getFiles({ prefix })
            await Promise.all(files?.map(file => {
                try {
                    const filePath = path.basename(file.name)
                    // console.log(filePath, ' ', fileName)
                    if (filePath === fileName) {
                        file.delete()
                    }
                } catch (error) {
                    throw error
                }
            })).then(() => {
                return res.status(200).send({ message: 'File Deleted' })
            }).catch((err) => {
                return res.status(500).send({ message: 'Found error try again' })
            })
        } else {
            return res.status(404).send({ message: 'Project not found Try again' })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }

}


module.exports = { getDesignerFiles, designerUpload, deleteDesignerFiles, getFilesOnVersionBasis, deleteFileOnVersionBasis }