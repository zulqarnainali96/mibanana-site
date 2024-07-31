const { Storage } = require('@google-cloud/storage')
const path = require('path')
const bcrypt = require('bcrypt')
const uniqID = require('uuid').v4
const gCloudStorage = new Storage({
    projectId: 'mibanana-app',
    keyFilename: path.join(__dirname, 'new-mibanana-key.json'),
    // projectId: 'mi-banana-401205',
    // keyFilename: path.join(__dirname, 'mibanana.json'),
})
const graphicProjectsModel = require('../models/graphic-design-model')
// const bucketName = `mi-banana-401205.appspot.com`
const bucketName2 = 'mibanana-files-bucket'
const test_bucket_mibanana = 'test-mibanana-bucket'

const bucket = gCloudStorage.bucket(test_bucket_mibanana)
const fs = require('fs')

const createFolder = async () => {
    const path = 'zain-12345610/brand/img.png'
    const [files] = await bucket.getFiles({ prefix: path })

    const blob = bucket.file(path)
    await blob.save('1.png', {
        metadata: {
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    })
    return { path }
}


const downloadFile = async (req, res) => {
    try {
        const [metaData] = await bucket.file(req.params.name).getMetadata()
        res.redirect(metaData.mediaLink)

    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' })
        console.log(err)
    }
}

module.exports = { downloadFile, bucket }
