const {Folder} = require('../models')
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
  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        let user = req.user
        let {folderId} = req.body

        let folder = await Folder.findOne({
          where: {
            id: folderId
          },
          include: Lesson
        })

        let course = await Course.findOne({
          where: {
            id: folder.Lesson.CourseId
          }
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


        // if (req.file) {
        //   let params = {
        //       Bucket: config.aws.bucket,
        //       Key: `${user.email}/${course.name}/${folder.Lesson.name}/${folder.path.slice(0, -1)}/${req.file.originalname}`,
        //       Body: req.file,
        //       ContentType: req.file.mimetype
        //   }
      
        //   // Uploading files to the bucket
        //   const response = await s3.upload(params).promise()
        //   req.body.url = response.Location
        // }

        console.log(req.body.file.length)
        console.log(Buffer.from(req.body.file, "binary"))
        console.log(Buffer.from(req.body.file, "binary").length)
        if (req.body.file) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${course.name}/${folder.Lesson.name}/${folder.path.slice(0, -1)}/${req.body.name}`,
              Body: req.body.file
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.url = response.Location
        }
        
        if (req.body.type == '' || !req.body.type) 
          req.body.type = req.file.mimetype

        await folder.increment('size', { 
          by: parseInt(req.body.size) || 0,
          transaction: t
        })

        let file = await folder.createFile(req.body)

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