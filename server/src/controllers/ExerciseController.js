const {Lesson} = require('../models')
const {User} = require('../models')
const {Exercise} = require('../models')
const {Course} = require('../models')
const AWS = require('aws-sdk')
const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async create (req, res) {
    try {
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
      if (req.files['demoPoster'].length > 0) {
        var params = {
            Bucket: config.aws.bucket,
            Key: `${user.email}/demoPoster/${lesson.id}/${req.files['demoPoster'][0].originalname}`,
            Body: req.files['demoPoster'][0].buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        req.body.demoPosterUrl = response.Location
      }

      if (req.files['demoVideo'].length > 0) {
        var params = {
            Bucket: config.aws.bucket,
            Key: `${user.email}/demoVideo/${lesson.id}/${req.files['demoVideo'][0].originalname}`,
            Body: req.files['demoVideo'][0].buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        req.body.demoVideoUrl = response.Location
      }

      if (req.files['video'].length > 0) {
        var params = {
            Bucket: config.aws.bucket,
            Key: `${user.email}/video/${lesson.id}/${req.files['video'][0].originalname}`,
            Body: req.files['video'][0].buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        req.body.videoUrl = response.Location
      }

      if (req.files['videoPoster'].length > 0) {
        var params = {
            Bucket: config.aws.bucket,
            Key: `${user.email}/videoPoster/${lesson.id}/${req.files['videoPoster'][0].originalname}`,
            Body: req.files['videoPoster'][0].buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        req.body.videoPosterUrl = response.Location
      }

      const exercise = await lesson.createExercise(req.body)
      await exercise.setLesson(lesson)

      res.send({
        exercise: exercise.toJSON()
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
      console.log("in get")
      const {uid} = req.query
      console.log('userId', req.query)
      const user = await User.findOne({
        where: {
          id: uid
        }
      })
      
      if (!user) {
        return res.status(403).send({
          error: "User information is incorrect"
        })
      }

      console.log("user found")

      var exercises = null
      exercises = await user.getExercises()

      if (!exercises) {
        return res.status(403).send({
          error: "No exercise found"
        })
      }
      
      console.log("exercise found")

      const exercisesJson = []
      exercises.forEach(exercise => {
        exercisesJson.push(exercise.toJSON())
      })
      // console.log(exercisesJson)
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
      const {lid} = req.query
      await Exercise.destroy({
        where: {
          id: lid
        }
      })

      res.send({
        data: 'ok'
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete exercise"
      })
    }
  },

  async edit (req, res) {
    try {
      const {exerciseObj} = req.body
      await Exercise.update({
        date: exerciseObj.date,
        name: exerciseObj.name,
        rhythms: exerciseObj.rhythms
      }, {
        where: {
          id: exerciseObj.id
        }
      })

      const exercise = await Exercise.findOne({
        where: {
          id: exerciseObj.id
        }
      })

      console.log(exercise.toJSON())
      res.send({
        exercise: exercise.toJSON()
      })

    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete exercise"
      })
    }
  }
}