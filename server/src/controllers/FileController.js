const {File} = require('../models')
const {Lesson} = require('../models')
const {Course} = require('../models')
const {sequelize} = require('../models')
const AWS = require('aws-sdk')
const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async list (req, res) {
    try {
      const {lid} = req.query
      const files = await File.findAll({
        where: {
          id: lid
        }
      })

      res.send({
        files: files.map(file => file.toJSON())
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve the files'
      })
    }
  },

  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        let user = req.user
        let {lessonId} = req.body

        let lesson = await Lesson.findOne({
          where: {
            id: lessonId
          },
          include: Course
        })
        
        // console.log(req.file)
        // AWS.config.update({
        //   accessKeyId : config.aws.id,
        //   secretAccessKey : config.aws.secret
        // });
        // AWS.config.region = 'ap-southeast-1'

        // let upload = new AWS.S3.ManagedUpload({
        //   partSize: 10 * 1024 * 1024,
        //   params: {
        //     Bucket: config.aws.bucket,
        //     Key: `${user.email}/${course.name}/${folder.Lesson.name}/${folder.path.slice(0, -1)}/${req.file.originalname}`,
        //     Body: req.file
        //   }
        // })
        // // upload.on('httpUploadProgress', (evt) => {
        // //   this.progress = parseInt((evt.loaded * 100) / evt.total)
        // // })
        // const response = await upload.promise()
        // req.body.url = response.Location
        // console.log(response)


        if (req.file) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${lesson.Course.name}/${lesson.name}/Resources/${req.file.originalname}`,
              Body: req.file.buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.url = response.Location
        }

        let file = await lesson.createFile(req.body)

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

  async destroy (req, res) {
    try {
      const {fid} = req.query
      await sequelize.transaction(async (t) => {
        await File.destroy({
          where: {
            id: fid
          },
          transaction: t,
          individualHooks: true
        })
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