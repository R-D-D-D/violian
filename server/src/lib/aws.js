const AWS = require('aws-sdk')
const config = require('../config/config')
const {Task} = require('../models')
const fs = require('fs')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

AWS.config.update({
  accessKeyId : config.aws.id,
  secretAccessKey : config.aws.secret
});
AWS.config.region = 'ap-southeast-1'

module.exports = {
  async managedUploadFromLocalFs (pathToFile, key) {
    try {
      const fileContent = fs.readFileSync(pathToFile)
      // const task = await Task.findOne({
      //   where: {
      //     id: taskId
      //   }
      // })
      let upload = new AWS.S3.ManagedUpload({
        partSize: 10 * 1024 * 1024,
        params: {
          Bucket: config.aws.bucket,
          Key: key,
          Body: fileContent
        }
      })
      // upload.on('httpUploadProgress', (evt) => {
      //   this.progress = parseInt((evt.loaded * 100) / evt.total)
      // })
      const response = await upload.promise()
      return response.Location
    } catch (err) {
      console.log(err)
      return false
    }
  },

  async managedUploadFromBuffer (key, buffer) {
    try {
      let upload = new AWS.S3.ManagedUpload({
        partSize: 10 * 1024 * 1024,
        params: {
          Bucket: config.aws.bucket,
          Key: key,
          Body: buffer
        }
      })
      // upload.on('httpUploadProgress', (evt) => {
      //   this.progress = parseInt((evt.loaded * 100) / evt.total)
      // })
      const response = await upload.promise()
      return response.Location
    } catch (err) {
      console.log(err)
      return null
    }
  },

  async normalUploadFromBuffer (key, buffer) {
    let params = {
      Bucket: config.aws.bucket,
      Key: key,
      Body: buffer
    }

    // Uploading files to the bucket
    const response = await s3.upload(params).promise()
    return response.Location
  }
}