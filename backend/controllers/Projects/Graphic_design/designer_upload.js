const User = require('../../../models/UsersLogin')
const Projects = require('../../../models/graphic-design-model')
const { bucket } = require('../../../google-cloud-storage/gCloudStorage')
const { v4: uniqID } = require('uuid')
const path = require('path')

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
                return obj
            })
            // console.log(filesInfo)
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
const designerUploadsOnVersion = async (req, res) => {
    const files = req.files
    const _id = req.params.id
    const versionNo = req.params.version
    console.log(req.params)
    console.log(req.files)
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            console.log('current p ', currentProject)
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            const prefix = `${name}-${user}/${project_title}-${_id}/version-${versionNo}/`
            await Promise.all(files?.map(file => {
                console.log('File ', file)
                const options = {
                    resumable: false,
                }
                const blob = bucket.file(prefix + file.originalname)
                blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
            }))
                .then(async () => {
                    if (currentProject?.version?.length > 0) {
                        const isCheck = currentProject.version?.includes(versionNo)
                        if(!isCheck){
                            const versions = currentProject.version
                            currentProject.version = [...versions, versionNo]
                            await currentProject.save()
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        } 
                        else {
                            return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                        }
                    } else {
                        currentProject.version = [versionNo]
                        await currentProject.save()
                        return res.status(201).send({ message: `Files uploaded on version-${versionNo}` })
                    }
                })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const getFilesOnVersionBasis = async (req, res) => {
    const _id = req.params.id
    const versionNo = req.params.version
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            const prefix = `${name}-${user}/${project_title}-${_id}/version-${versionNo}/`
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
                return obj
            })
            if (filesInfo.length > 0) {
                return res.status(200).send({ message: 'Files found on verion ' + versionNo, filesInfo })
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
                const prefix = `${name}-${userId}/${project_title}-${_id}/version-${versionNo}/`
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
                        return res.status(200).send({ message: 'Version Deleted' })
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
    console.log(req.params.id, req.params.filename)
    if (!_id) {
        return res.status(400).send({ message: 'ID not found try again' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            const prefix = `${name}-${user}/${project_title}-${_id}/designer_uploads/`
            const [files] = await bucket.getFiles({ prefix })
            await Promise.all(files?.map(file => {
                try {
                    const filePath = path.basename(file.name)
                    console.log(filePath, ' ', fileName)
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
const deleteDesigners = async (req, res) => {
    const { user, project_id } = req.body
    if (!project_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const designers = await User.findById(user)
        if (designers) {
            const findProject = await Projects.findById(project_id)
            const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
            findProject.team_members = filterTeamMembers
            findProject.status = 'Project manager'
            findProject.is_active = false
            findProject.save()
            return res.status(200).send({ message: "Team member removed" })
        } else {
            return res.status(404).send({ message: "Team member Not Found" })
        }
    } catch (err) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}

module.exports = { deleteDesigners, getDesignerFiles, designerUpload, deleteDesignerFiles, designerUploadsOnVersion, getFilesOnVersionBasis, deleteFileOnVersionBasis }