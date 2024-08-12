const { Storage } = require('@google-cloud/storage')
const path = require('path')
const gCloudStorage = new Storage({
    projectId: 'mibanana-app',
    keyFilename: path.join(__dirname, 'new-mibanana-key.json'),
    // projectId: 'mi-banana-401205',
    // keyFilename: path.join(__dirname, 'mibanana.json'),
})
const bucketName2 = 'mibanana-files-bucket'
const test_bucket_mibanana = 'test-mibanana-bucket'

const bucket = gCloudStorage.bucket(bucketName2)

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
