const {Folder} = require('../models')
const {File} = require('../models')
const {sequelize} = require('../models')
const AWS = require('aws-sdk')
const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {folderId} = req.body

        let folder = await Folder.findOne({
          where: {
            id: folderId
          }
        })

        if (req.file) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/video/${lesson.id}/${req.files['video'][0].originalname}`,
              Body: req.files['video'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.videoUrl = response.Location
        }

        let file = null

        res.send({
          file: file.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the file'
      })
    }
  },

  async list (req, res) {
    try {
      let {fid} = req.query
      
      let filesJson = []
      filesJson = await Promise.all(files.map(async file => {
        let fileJson = file.toJSON()
        // file.parents = await file.getParents()
        // file.children = await file.getChildren()
        fileJson.parents = (await file.getParents()).map(parent => parent.toJSON())
        fileJson.children = (await file.getChildren()).map(child => child.toJSON())
        filesJson.push(fileJson)
        return fileJson
      }))
      res.send({
        files: filesJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve files"
      })
    }
  },

  async getUnread (req, res) {
    try {
      const {uid} = req.query
      const {cid} = req.query
      const course = await Course.findOne({
        where: {
          id: cid
        },
        include: Lesson
      })

      if (!course) {
        res.status(403).send({
          error: 'Course information incorrect'
        })
      }

      var result = 0

      for (var i = 0; i < course.Lessons.length; i++) {
        var file = await file.findOne({
          where: {
            LessonId: course.Lessons[i].id,
            UserId: uid
          }
        })
        result += file.unreadStudentPost
      }

      res.send({
        unread: result
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to get unread of file"
      })
    }
  },

  async destroy (req, res) {
    try {
      const {tid} = req.query
      await file.destroy({
        where: {
          id: tid
        }
      })

      res.send({
        data: 'ok'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to delete file"
      })
    }
  }
}