const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const config = require('../../config')

const upload = multer({
  dest: config.TEMP_FILES_DIR,
  limits: {
    fieldNameSize: 100,
    fieldSize: 1024 * 1024,
    fields: 30,
    fileSize: 20 * 1024 * 1024,
    files: 5,
    parts: 35,
    fieldNestingDepth: 5,
    fieldArrayIndexLimit: 10
  }
})

const s3 = new S3Client({
  endpoint: config.PS_CLOUD_URL,
  region: 'auto',
  credentials: {
    accessKeyId: config.PS_CLOUD_ACCESS_KEY,
    secretAccessKey: config.PS_CLOUD_SECRET_KEY
  },
  forcePathStyle: true
})

async function uploadFile({
  bucketName,
  fileName,
  file,
  generateName,
  isBase64
}) {
  let fileNameToUpload = fileName

  if (generateName) {
    const fileNameSplitted = fileName.split('.')
    const extension = fileNameSplitted[fileNameSplitted.length - 1]
    fileNameToUpload = `${uuidv4()}.${extension}`
  }

  const params = {
    Key: fileNameToUpload,
    Bucket: bucketName,
    Body: file,
    ContentEncoding: '',
    ContentType: ''
  }

  if (isBase64) {
    const base64Data = Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    )
    const type = file.split(';')[0].split('/')[1]

    params.Body = base64Data
    params.ContentEncoding = 'base64'
    params.ContentType = `image/${type}`
  }

  const command = new PutObjectCommand(params)
  const result = await s3.send(command)

  const fileUrl = `${config.PS_CLOUD_URL}/${bucketName}/${fileNameToUpload}`
  return fileUrl
}
module.exports = { uploadFile, upload }
