const AWS = require('aws-sdk')
const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define('Exercise', {
    name: {
      type: DataTypes.STRING
    },
    melody: {
      type: DataTypes.TEXT
    },
    timeSignature: {
      type: DataTypes.STRING
    },
    numberOfBars: {
      type: DataTypes.INTEGER
    },
    bpm: {
      type: DataTypes.INTEGER
    },
    demoUrl: {
      type: DataTypes.STRING
    },
    demoPosterUrl: {
      type: DataTypes.STRING
    },
    videoUrl: {
      type: DataTypes.STRING
    },
    videoPosterUrl: {
      type: DataTypes.STRING
    },
    demoStartTime: {
      type: DataTypes.INTEGER
    }
  })

  Exercise.associate = function (models) {
    Exercise.belongsTo(models.Lesson)
  }

  Exercise.beforeDestroy(async (exercise, options) => {
    console.log('in hook')
    if (exercise.videoUrl) {
      // delete the previous video
      var originalVideoUrl = exercise.videoUrl.split('/')
      originalVideoUrl.splice(0, 3)
      var newVideoUrl = originalVideoUrl.join('/')
      var deleteVideoParams = {
        Bucket: config.aws.bucket,
        Key: newVideoUrl
      }

      await s3.deleteObject(deleteVideoParams).promise()
    } else if (exercise.demoUrl) {
      // delete the previous video
      var originalDemoUrl = exercise.demoUrl.split('/')
      originalDemoUrl.splice(0, 3)
      var newDemoUrl = originalDemoUrl.join('/')
      var deleteDemoParams = {
        Bucket: config.aws.bucket,
        Key: newDemoUrl
      }

      await s3.deleteObject(deleteDemoParams).promise()
    }
  })
  
  return Exercise
}