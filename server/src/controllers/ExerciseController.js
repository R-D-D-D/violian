const {Lesson} = require('../models')
const {User} = require('../models')
const {Exercise} = require('../models')
const {Course} = require('../models')
const AWS = require('aws-sdk')
const config = require('../config/config')
const {sequelize} = require('../models')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {lid} = req.body
        const lesson = await Lesson.findOne({
          where: {
            id: lid
          },
          include: Course
        }) 
        
        if (!lesson) {
          return res.status(403).send({
            error: "Lesson information is incorrect"
          })
        }
  
        const user = await lesson.Course.getTutor()
  
        // console.log(req.files)
        // format to present score
        if (req.body.useXml) {
          if (req.files['musicXml'] && req.files['musicXml'].length > 0) {
            let params = {
                Bucket: config.aws.bucket,
                Key: `${user.email}/musicXml/${lesson.id}/${req.files['musicXml'][0].originalname}`,
                Body: req.files['musicXml'][0].buffer
            }
        
            // Uploading files to the bucket
            const response = await s3.upload(params).promise()
            req.body.musicXmlUrl = response.Location
            console.log('in xml', response)
          }
        }
  
        if (req.files['demoPoster'] && req.files['demoPoster'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/demoPoster/${lesson.id}/${req.files['demoPoster'][0].originalname}`,
              Body: req.files['demoPoster'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.demoPosterUrl = response.Location
        }
  
        if (req.files['demo'] && req.files['demo'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/demo/${lesson.id}/${req.files['demo'][0].originalname}`,
              Body: req.files['demo'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.demoUrl = response.Location
        }
  
        if (req.files['video'] && req.files['video'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/video/${lesson.id}/${req.files['video'][0].originalname}`,
              Body: req.files['video'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.videoUrl = response.Location
        }
  
        if (req.files['videoPoster'] && req.files['videoPoster'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/videoPoster/${lesson.id}/${req.files['videoPoster'][0].originalname}`,
              Body: req.files['videoPoster'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.videoPosterUrl = response.Location
        }
  
        console.log(req.body)
        const exercise = await lesson.createExercise(req.body)
        await exercise.setLesson(lesson)
  
        res.send({
          exercise: exercise.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an  error has occured trying to create the exercise'
      })
    }
  },

  async list (req, res) {
    try {
      const {lid} = req.query
      const lesson = await Lesson.findOne({
        where: {
          id: lid
        }
      })
      
      if (!lesson) {
        return res.status(403).send({
          error: "Lesson information is incorrect"
        })
      }

      let exercises = await lesson.getExercises()

      if (!exercises) {
        return res.status(403).send({
          error: "No exercise found"
        })
      }
      
      const exercisesJson = []
      exercises.forEach(exercise => {
        exercisesJson.push(exercise.toJSON())
      })
      res.send({
        exercises: exercisesJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve exercises"
      })
    }
  },

  async destroy (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {eid} = req.query
        await Exercise.destroy({
          where: {
            id: eid
          }
        })
  
        res.send({
          data: 'ok'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete exercise"
      })
    }
  },

  async edit (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {eid} = req.body
        const exercise = await Exercise.findOne({
          where: {
            id: eid
          },
          include: Lesson
        })
        
        if (!exercise) {
          return res.status(403).send({
            error: "Exercise information is incorrect"
          })
        }
  
        const course = await exercise.Lesson.getCourse()
        const user = await course.getTutor()
        let possibleAttr = ['demo', 'demoPoster', 'video', 'videoPoster']
        let changedAttr = []
        if (req.files['demo'] && req.files['demo'].length > 0) 
          changedAttr.push(0)
        if (req.files['demoPoster'] && req.files['demoPoster'].length > 0) 
          changedAttr.push(1)
        if (req.files['video'] && req.files['video'].length > 0) 
          changedAttr.push(2)
        if (req.files['videoPoster'] && req.files['videoPoster'].length > 0) 
          changedAttr.push(3)
        
        for (let i = 0; i < changedAttr.length; i++) {
          let originalKey = null
          if (changedAttr[i] == 0 && exercise.demoUrl)
            originalKey = exercise.demoUrl.split(`${possibleAttr[changedAttr[i]]}/${exercise.Lesson.id}/`)[1]
          if (changedAttr[i] == 1 && exercise.demoPosterUrl)
            originalKey = exercise.demoPosterUrl.split(`${possibleAttr[changedAttr[i]]}/${exercise.Lesson.id}/`)[1]
          if (changedAttr[i] == 2 && exercise.videoUrl)
            originalKey = exercise.videoUrl.split(`${possibleAttr[changedAttr[i]]}/${exercise.Lesson.id}/`)[1]
          if (changedAttr[i] == 3 && exercise.videoPosterUrl)
            originalKey = exercise.videoPosterUrl.split(`${possibleAttr[changedAttr[i]]}/${exercise.Lesson.id}/`)[1]
  
          if (originalKey != null) {
            // delete the previous video
            let deleteParams = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${possibleAttr[changedAttr[i]]}/${exercise.Lesson.id}/${originalKey}`
            }
    
            await s3.deleteObject(deleteParams).promise()
          }
  
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${possibleAttr[changedAttr[i]]}/${exercise.Lesson.id}/${req.files[`${possibleAttr[changedAttr[i]]}`][0].originalname}`,
              Body: req.files[`${possibleAttr[changedAttr[i]]}`][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
  
          if (changedAttr[i] == 0)
            req.body.demoUrl = response.Location
          if (changedAttr[i] == 1)
            req.body.demoPosterUrl = response.Location
          if (changedAttr[i] == 2)
            req.body.videoUrl = response.Location
          if (changedAttr[i] == 3)
            req.body.videoPosterUrl = response.Location
        }
  
        await Exercise.update(req.body, {
          where: {
            id: eid
          }
        })
  
        await exercise.reload()
        res.send({
          exercise: exercise.toJSON()
        })
      })
    } catch (err) {
      res.status(500).send({
        error: 'an  error has occured trying to create the exercise'
      })
    }
  }
}