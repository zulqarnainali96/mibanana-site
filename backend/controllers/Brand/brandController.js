const asyncHandler = require('express-async-handler')
const brand_model = require("../../models/Brands/brandModel")
const { bucket } = require("../../google-cloud-storage/gCloudStorage")
const User = require("../../models/UsersLogin")
const path = require('path')
const { v4: uniqID } = require('uuid')
const graphicDesignModel = require('../../models/graphic-design-model')

const createBrand = async (req, res) => {
    const { user, name, brand_name, brand_description, web_url, facebook_url, instagram_url, twitter_url, linkedin_url, tiktok_url } = req.body
    const files = req.files
    if (!files.length) {
        return res.status(402).send({ message: 'Please provide logo images' })
    }
    if (!user) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    else if (!brand_name || !brand_description || !name) {
        return res.status(402).send({ message: 'please provide req field name (brand name & brand description)' })
    }
    try {
        const findDuplicate = await brand_model.findOne({ brand_name }).lean().exec()
        if (findDuplicate) {
            return res.status(409).json({ message: 'brand name already exists' })
        }
        const obj = {
            user, brand_name, brand_description, web_url, facebook_url,
            instagram_url, twitter_url, linkedin_url, tiktok_url, files: []
        }
        const createNewBrand = await brand_model.create(obj)
        if (createNewBrand !== null) {
            let username = name.replace(/\s/g, '')
            let brandName = createNewBrand.brand_name.replace(/\s/g, '')
            const prefix = `${username}-${user}/${brandName}-${createNewBrand._id}/`
            await Promise.all(files.map(file => {
                const options = {
                    resumable: true,
                    metadata: {
                        contentType: file.type, // Replace with the appropriate content type
                    }
                }
                const blob = bucket.file(prefix + file.originalname)
                blob.createWriteStream(options).on('finish', async () => {

                    // console.log('files uploaded')
                    const [files] = await bucket.getFiles({ prefix })
                    let filesInfo = files?.map((file) => {
                        let f = {}
                        f.id = uniqID(),
                            f.name = path.basename(file.name),
                            f.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                            f.download_link = file.metadata.mediaLink,
                            f.type = file.metadata.contentType,
                            f.size = file.metadata.size,
                            f.time = file.metadata.timeCreated,
                            f.upated_time = file.metadata.updated
                        return f
                    })
                    // console.log(filesInfo)
                    if (filesInfo.length > 0) {
                        // console.log('files info')
                        const id = createNewBrand._id
                        const getbrand = await brand_model.findById(id).lean()
                        // console.log('get brand', getbrand)
                        if (getbrand.files.length > 0) {
                            const arr2 = getbrand.files
                            const checkFiles = filesInfo.filter(item1 => !arr2.some(item2 => item1.id === item2.id));
                            await brand_model.findByIdAndUpdate(id, { files: checkFiles })
                            // console.log('files saved and brand updated')
                        }
                        else if (getbrand.files.length === 0) {
                            await brand_model.findByIdAndUpdate(id, { files: filesInfo })
                            // return res.status(201).send({ message: 'Brand Created', createBrand })
                        }
                    } else {
                        // console.log('file info error')
                        // const id = createBrand._id
                        // await brand_model.findByIdAndRemove(id)
                        // return res.status(400).send({ message: 'Files save error' })
                    }

                }).on('error', (err) => { console.log(err) }).end(file.buffer)
            }))
                .then(() => {
                    return res.status(201).send({ message: 'Brand Created', createBrand: createNewBrand })

                }).catch(async (err) => {
                    const id = createNewBrand._id
                    await brand_model.findByIdAndRemove(id)
                    return res.status(400).send({ message: 'Failed to create brand try again!', err })
                })
        } else {
            return res.status(400).send({ message: 'Found error Try again' })
        }
    } catch (err) {
        // const id = createNewBrand._id
        // await brand_model.findByIdAndRemove(id)
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const getBrandList = async (req, res) => {
    const user = req.params.id
    if (!user) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    try {
        const brands = await brand_model.find({ user: user }).lean().exec()
        const [users] = await User.find({ _id: user })
        if (users?.roles.includes("Admin") || users?.roles.includes("Project-Manager")) {
            const allBrands = await brand_model.find()
            return res.status(200).send({ message: 'All List Found', brandList: allBrands })

        } else if (users?.roles.includes("Graphic-Designer")) {
            const projects = await graphicDesignModel.find()
            const filteredProjects = projects.filter(item =>
                item.team_members.some(member => member._id === user)
            );
            if (filteredProjects?.length > 0) {
                const allBrands = await brand_model.find()
                let list = []
                for (let v = 0; v < filteredProjects?.length; v++) {
                    const currentProject = filteredProjects[v]
                    if (typeof currentProject.brand === "object") {
                        const filterbrand = allBrands?.filter(list => list?.brand_name === currentProject.brand?.brand_name)
                        if (list?.length > 0) {
                            list += [...list, ...filterbrand]
                        } else {
                            list = filterbrand
                        }
                    }
                    else {
                        const filterbrand = allBrands?.filter(list => list?.brand_name === currentProject.brand)
                        if (list?.length > 0) {
                            list = [...list, ...filterbrand]
                        } else {
                            list = filterbrand
                        }

                    }
                }
                return res.status(200).send({ message: 'List Found', brandList: list })
            }
            return res.status(404).send({ message: 'No brand found' })

        }
        else {
            if (brands !== null) {
                return res.status(200).send({ message: 'List Found', brandList: brands })
            } else {
                return res.status(400).json({ message: 'No brand found' })
            }
        }
    } catch (err) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const deleteBrandList = async (req, res) => {
    const projectId = req.params.id
    if (!projectId) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    try {
        const findBrand = await brand_model.findById({ _id: projectId })
        if (findBrand) {
            const findUser = await User.findById({ _id: findBrand.user })
            if (findUser) {
                // console.log(findUser)
                let { brand_name, _id: brand_id } = findBrand
                let { name, _id } = findUser
                brand_name = brand_name.replace(/\s/g, '')
                name = name.replace(/\s/g, '')
                const prefix = `${name}-${_id}/${brand_name}-${brand_id}/`

                const [files] = await bucket.getFiles({ prefix })
                await Promise.all(
                    files?.map(async (file) => {
                        try {
                            await file.delete();
                            // console.log(`Deleted file: ${file.name}`);
                        } catch (error) {
                            throw error
                        }
                    })
                ).then(async () => {
                    await brand_model.findByIdAndRemove(projectId)
                    return res.status(200).send({ message: 'Brand Deleted' })
                }).catch((err) => { throw err })
            } else {
                return res.status(400).send({ message: 'User Not Found try again!' })
            }
        } else {
            return res.status(404).send({ message: 'Brand Not Found' })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }

}

const updateBrandList = async (req, res) => {
    const { user, _id, name, brand_name, brand_description, web_url, facebook_url, instagram_url, twitter_url, linkedin_url, tiktok_url, files_name, add_files } = req.body

    if (!user) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    else if (!brand_name || !brand_description || !name) {
        return res.status(402).send({ message: 'please provide req field name (brand name & brand description)' })
    }

    try {
        const findBrand = await brand_model.findById(_id)
        if (findBrand) {
            if (files_name?.length > 0) {
                let brand_name = findBrand.brand_name.replace(/\s/g, '')
                let user_name = name.replace(/\s/g, '')
                const prefix = `${user_name}-${user}/${brand_name}-${findBrand._id}/`
                const [files] = await bucket.getFiles({ prefix })
                if (files?.length > 0) {
                    await Promise.all(
                        files?.map(async (file) => {
                            const name = path.basename(file.name)
                            if (files_name.includes(name)) {
                                await file.delete()
                                const { files } = await brand_model.findById(_id)
                                const results = files?.filter(item => !files_name.some(item2 => item.name === item2))
                                await brand_model.findByIdAndUpdate(_id, { files: results })
                            }
                        })).then(async () => {
                            const save = await brand_model.findByIdAndUpdate(_id, {
                                brand_name, brand_description, web_url, facebook_url, instagram_url,
                                twitter_url, linkedin_url, tiktok_url
                            })
                            if (save) {
                                return res.status(200).send({ message: 'Brand Updated' })
                            }
                        })
                }
                if (add_files?.length > 0) {

                }
                else {
                    // console.log('No Files Found in Bucket =>>>>>')
                    const { files } = await brand_model.findById(_id)
                    const results = files?.map(item => !files_name.some(item2 => item.name == item2))
                    await brand_model.findByIdAndUpdate(_id, {
                        files: results, brand_name, brand_description, web_url, facebook_url, instagram_url,
                        twitter_url, linkedin_url, tiktok_url
                    })
                    return res.status(200).send({ message: 'Brand Updated Successfully' })
                }
            } else {
                const save = await brand_model.findByIdAndUpdate(_id, {
                    brand_name, brand_description, web_url, facebook_url, instagram_url,
                    twitter_url, linkedin_url, tiktok_url
                })
                if (save) {
                    return res.status(200).send({ message: 'Brand Updated' })
                }
            }

        } else {
            res.status(404).send({ message: 'Brand not found' })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}
const addMoreImages = async (req, res) => {
    const { brandName, brand_id } = req.body
    const files = req.files
    const _id = req.params.id
    if (!_id) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    if (!brandName || !brand_id) {
        return res.status(402).send({ message: 'Error Unable to add new Images brand id not found' })
    }
    if (files.length === 0) {
        return res.status(402).send({ message: 'Please provide files to upload' })
    }
    try {
        const user = await User.findById(_id)
        if (user) {
            const username = user.name.replace(/\s/g, '')
            const brand_name = brandName.replace(/\s/g, '')
            const prefix = `${username}-${user._id}/${brand_name}-${brand_id}/`

            await Promise.all(files.map(file => {
                const options = {
                    resumable: true,
                    metadata: {
                        contentType: file.type, // Replace with the appropriate content type
                    }
                }
                const blob = bucket.file(prefix + file.originalname)
                blob.createWriteStream(options).on('finish', async () => {
                    const [files] = await bucket.getFiles({ prefix })
                    let filesInfo = files?.map((file) => {
                        let f = {}
                        f.id = uniqID(),
                            f.name = path.basename(file.name),
                            f.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                            f.download_link = file.metadata.mediaLink,
                            f.type = file.metadata.contentType,
                            f.size = file.metadata.size,
                            f.time = file.metadata.timeCreated,
                            f.upated_time = file.metadata.updated
                        return f
                    })
                    if (filesInfo.length > 0) {
                        const getbrand = await brand_model.findById(brand_id)
                        if (getbrand.files.length > 0) {
                            const arr2 = getbrand.files
                            const checkFiles = filesInfo.filter(item1 => !arr2.some(item2 => item1.id === item2.id));
                            await brand_model.findByIdAndUpdate(brand_id, { files: checkFiles })
                        }
                        else if (getbrand.files.length === 0) {
                            await brand_model.findByIdAndUpdate(brand_id, { files: filesInfo })
                        }
                    } else {
                        return res.status(500).send({ message: 'File save error' })
                    }
                }).on('error', (err) => { throw err }).end(file.buffer)
            })).then(() => {
                return res.status(201).send({ message: 'New Files saved' })
            }).catch(async (err) => {
                return res.status(500).send({ message: 'Error while saving files ' })
            })

        } else {
            return res.status(404).send({ message: 'No User found ' })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error ' })
    }
}
module.exports = { getBrandList, createBrand, deleteBrandList, updateBrandList, addMoreImages }


