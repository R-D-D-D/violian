const AWS = require('aws-sdk')
const config = require('../config/config')

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    size: DataTypes.INTEGER,
    type: DataTypes.STRING
  })

  File.associate = function (models) {
    File.belongsTo(models.Folder)
  }
  
  File.beforeDestroy(async (file, options) => {
    if (file.url) {
      // delete the previous video
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