const { bucket } = require('../../google-cloud-storage/gCloudStorage')
const User = require('../../models/UsersLogin')
const { v4: uniqID } = require('uuid')
const path = require('path')


const UploadProfileImage = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (!req.body.email) {
        return res.status(402).json({ message: "Email is required" })
    }
    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).send({ message: 'User not Found try login again' })

        if (req.file) {
            let username = user.name.replace(/\s/g, '')
            const location = `${username}-${user._id}/profile-image/`
            const [profile] = await bucket.getFiles({ prefix: location })
            if (profile.length > 0) {
                await Promise.all(profile.map(async (file) => {
                    try {
                        await file.delete()
                    } catch (err) {
                        console.log('error deleteing files')
                    }
                }))

            }
        }

        user.name = req.body.fullname
        user.email = req.body.email
        user.phone_no = req.body.phone_no
        let name = user.name.replace(/\s/g, '')
        const prefix = `${name}-${user._id}/profile-image/`
        const blob = bucket.file(prefix + req.file.originalname)
        blob.createWriteStream({ resumable: false }).on('finish', async () => {
            const [file] = await bucket.getFiles({ prefix })
            if (file.length > 0) {
                let filesInfo = file?.map((file) => {
                    let obj = {}
                    obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name)
                    return obj
                })
                if (filesInfo.length > 0) {

                    const [profile] = filesInfo
                    // console.log(profile.url)
                    user.avatar = profile.url
                    const profileData = await user.save()

                    if (profileData) {
                        const {name, email,phone_no, avatar} = profileData
                        return res.status(201).send({
                            message: 'Profile Updated', profileData: {
                                name,
                                email,
                                phone_no,
                                avatar,
                            }
                        })
                    } else {
                        return res.status(400).send({ message: 'Found error try again!' })
                    }

                }
            } else {
                throw new Error('Found error try again')
            }
        }).on('error', (err) => {
            console.log(err)
            throw err
        }).end(req.file.buffer)

    } catch (error) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const UploadWithoutProfileImage = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (!req.body.email) {
        return res.status(402).json({ message: "Email is required" })
    }
    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).send({ message: 'User not Found try login again' })

        user.name = req.body.fullname
        user.email = req.body.email
        user.phone_no = req.body.phone_no

        const profileData = await user.save()
        if (profileData) {
            const { phone_no, email, name } = profileData
            return res.status(201).send({
                message: 'Profile Updated', profileData: { name, email, phone_no }
            })
        } else {
            return res.status(400).send({ message: 'Found error try again!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal Server error' })
    }
}

module.exports = { UploadProfileImage, UploadWithoutProfileImage }