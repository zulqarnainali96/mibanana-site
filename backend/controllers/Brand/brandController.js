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
            const prefix = `${username}-${user}/brands/${brandName}-${createNewBrand._id}/`
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
                        f.id = uniqID();
                        f.name = path.basename(file.name);
                        f.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name);
                        f.download_link = file.metadata.mediaLink;
                        f.type = file.metadata.contentType;
                        f.size = file.metadata.size;
                        f.time = file.metadata.timeCreated;
                        f.upated_time = file.metadata.updated;
                        f.folder_name = prefix;

                        return f
                    })
                    if (filesInfo.length > 0) {
                        const id = createNewBrand._id
                        const getbrand = await brand_model.findById(id).lean()
                        if (getbrand) {
                            if (getbrand.files.length > 0) {
                                const arr2 = getbrand.files
                                const checkFiles = filesInfo.filter(item1 => !arr2.some(item2 => item1.id === item2.id));
                                updatedBrand = checkFiles
                                await brand_model.findByIdAndUpdate(id, { files: checkFiles })
                            }
                            else if (getbrand.files.length === 0) {
                                updatedBrand = filesInfo
                                await brand_model.findByIdAndUpdate(id, { files: filesInfo })
                            }
                        }
                    } else {
                        const id = createNewBrand._id
                        await brand_model.findByIdAndRemove(id)
                        return res.status(400).send({ message: 'Files save error' })
                    }

                }).on('error', (err) => {
                    // return res.status(400).send({ message: 'Files save error' })
                }).end(file.buffer)
            }))
                .then(() => {
                    return res.status(201).send({ message: "Brand Created", customerBrand: createNewBrand })
                }).catch(async (err) => {
                    const id = createNewBrand._id
                    await brand_model.findByIdAndRemove(id)
                    return res.status(400).send({ message: 'Failed to create brand try again!', err })
                })
        } else {
            return res.status(400).send({ message: 'Failed to create brand Try again' })
        }
    } catch (err) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const getSingleBrandFile = async (req, res) => {
    const _id = req.params.id
    if (!_id) return
    try {
        const brand = await brand_model.findById(_id)
        console.log(brand)
        return res.status(201).send({ message: 'Brand Files', files: brand.files })
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error ' })
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
        if (users?.roles.includes("Admin") || users?.roles.includes("Project-Manager") || users?.roles.includes("Graphic-Designer")) {
            const allBrands = await brand_model.find()
            return res.status(200).send({ message: 'All List Found', brandList: allBrands })
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
    const _id = req.params.id
    if (!_id) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    try {
        const findBrand = await brand_model.findById(_id)
        if (findBrand) {
            const { files, _id } = findBrand
            // Delete brand files from storage
            for (let v = 0; files.length > v; v++) {
                const file = files[v];
                const prefix = file.folder_name + file.name
                await bucket.file(prefix).delete().then(() => {
                    console.log('Files deleted from storage')
                }).catch(err => {
                    console.log(err)
                    return res.status(500).send({ message: 'Failed to delete file Try again', err })
                })
            }
            const deleteBrand = await brand_model.findByIdAndRemove(_id)
            if (deleteBrand) return res.status(200).send({ message: 'Brand Deleted' })
        } else {
            return res.status(404).send({ message: 'Brand Not Found' })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }

}

const updateBrandList = async (req, res) => {
    const { user, _id, name, brand_name, brand_description, web_url, facebook_url, instagram_url, twitter_url, linkedin_url, tiktok_url, files_name } = req.body

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
                for (let i = 0; files_name.length > i; i++) {
                    const prefix = files_name[i].prefix
                    const unique = files_name[i].unique
                    const file = bucket.file(prefix)
                    await file.delete().then(async () => {
                        console.log(`Deleted file: ${prefix}`);
                        const { files } = await brand_model.findById(_id)
                        const result = files?.filter(file => file.id !== unique)
                        await brand_model.findByIdAndUpdate(_id, { files: result })
                    }).catch(err => {
                        return res.status(500).send({ message: 'Failed to delete file Try again', err })
                    })
                }
            }
            if (brand_name || brand_description || web_url || facebook_url || instagram_url ||
                twitter_url || linkedin_url || tiktok_url) {
                const save = await brand_model.findByIdAndUpdate(_id, {
                    brand_name, brand_description, web_url, facebook_url, instagram_url,
                    twitter_url, linkedin_url, tiktok_url
                })
                if (save) {
                    const brandData = await brand_model.findById(_id)
                    return res.status(200).send({ message: 'Brand Updated', brandData })
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
            const prefix = `${username}-${user._id}/brands/${brand_name}-${brand_id}/`

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
                        f.folder_name = prefix
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
            })).then(async () => {
                const brandData = await brand_model.findById(brand_id)
                return res.status(201).send({ message: 'New Files saved', brandData })
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

const UpdateAllBrandDetails = async (req, res) => {
    const { user, _id, name, brand_name, brand_description, web_url, facebook_url, instagram_url, twitter_url, linkedin_url, tiktok_url, files_name
    } = req.body
    let newImages = req.files;
    if (!user) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    else if (!brand_name || !brand_description || !name) {
        return res.status(402).send({ message: 'please provide req field name (brand name & brand description)' })
    }
    try {
        const findBrand = await brand_model.findById(_id)
        if (findBrand) {
            if (brand_name || brand_description || web_url || facebook_url || instagram_url ||
                twitter_url || linkedin_url || tiktok_url) {
                const save = await brand_model.findByIdAndUpdate(_id, {
                    brand_name, brand_description, web_url, facebook_url, instagram_url,
                    twitter_url, linkedin_url, tiktok_url
                })

            }
            if (files_name?.length > 0) {
                for (let i = 0; files_name.length > i; i++) {
                    const prefix = files_name[i].prefix
                    const unique = files_name[i].unique
                    const file = bucket.file(prefix)
                    await file.delete().then(async () => {
                        console.log(`Deleted file: ${prefix}`);
                        const { files } = await brand_model.findById(_id)
                        const result = files?.filter(file => file.id !== unique)
                        await brand_model.findByIdAndUpdate(_id, { files: result })
                    }).catch(err => {
                        return res.status(500).send({ message: 'Failed to delete file Try again', err })
                    })
                }
            }
            if (newImages.length > 0) {
                const username = name.replace(/\s/g, '')
                const brand_na = brand_name.replace(/\s/g, '')
                const prefix = `${username}-${user}/brands/${brand_na}-${_id}/`

                await Promise.all(newImages.map(file => {
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
                            f.folder_name = prefix
                            return f
                        })
                        if (filesInfo.length > 0) {
                            const getbrand = await brand_model.findById(_id)
                            if (getbrand.files.length > 0) {
                                const arr2 = getbrand.files
                                const checkFiles = filesInfo.filter(item1 => !arr2.some(item2 => item1.id === item2.id));
                                await brand_model.findByIdAndUpdate(_id, { files: checkFiles })
                            }
                            else if (getbrand.files.length === 0) {
                                await brand_model.findByIdAndUpdate(_id, { files: filesInfo })
                            }
                        } else {
                            return res.status(500).send({ message: 'File save error' })
                        }
                    }).on('error', (err) => { throw err }).end(file.buffer)
                })).then(async () => { }).catch((err) => {
                    return res.status(500).send({ message: 'Error while saving files ' })
                })

            }
            const brandData = await brand_model.findById(_id)
            return res.status(201).send({ message: 'Brand Updated', brandData })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error ' })
    }
}

module.exports = { getBrandList, createBrand, deleteBrandList, updateBrandList, addMoreImages, UpdateAllBrandDetails, getSingleBrandFile }


