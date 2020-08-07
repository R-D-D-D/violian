const AWS = require('aws-sdk')
const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    size: DataTypes.INTEGER,
    type: DataTypes.STRING
  })

  File.associate = function (models) {
    File.belongsTo(models.Lesson)
  }
  
  File.beforeDestroy(async (file, options) => {
    console.log('in file before destroy hook')
    if (file.url) {
      var originalUrl = file.url.split('/')
      originalUrl.splice(0, 3)
      var newUrl = originalUrl.join('/')
      var deleteParams = {
        Bucket: config.aws.bucket,
        Key: newUrl
      }

      await s3.deleteObject(deleteParams).promise()
    }
  })

  return File
}