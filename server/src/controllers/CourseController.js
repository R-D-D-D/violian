const {Course} = require('../models')
const {User} = require('../models')
const {Sequelize} = require('sequelize')
const {Op} = require('sequelize')
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
        const {TutorId} = req.body
        const user = await User.findOne({
          where: {
            id: TutorId
          }
        })
        
        if (!user) {
          return res.status(403).send({
            error: "User information is incorrect"
          })
        }

        if (req.files['previewVideo'] && req.files['previewVideo'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${req.body.name}/previewVideo/${req.files['previewVideo'][0].originalname}`,
              Body: req.files['previewVideo'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.previewVideoUrl = response.Location
        }

        if (req.files['coverPhoto'] && req.files['coverPhoto'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${req.body.name}/coverPhoto/${req.files['coverPhoto'][0].originalname}`,
              Body: req.files['coverPhoto'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.coverPhotoUrl = response.Location
        } 
  
        req.body.duration = 0
        const course = await user.createCourse(req.body)
        await course.setTutor(user)
  
        res.send({
          course: course.toJSON()
        })
      })
    } catch (err) {
      console.log('from course', err)
      res.status(500).send({
        error: 'an  error has occured trying to create the course'
      })
    }
  },

  async list (req, res) {
    try {
      const uid = req.user.id
      const user = await User.findOne({
        where: {
          id: uid
        }
      })
      
      if (!user || !user.isTutor) {
        return res.status(403).send({
          error: "User information is incorrect"
        })
      }

      var courses = null
      courses = await user.getCourses()

      if (!courses) {
        return res.status(403).send({
          error: "No course found"
        })
      }

      var coursesJson = []

      coursesJson = await Promise.all(courses.map(async course => {
        var courseJson = course.toJSON()
        var lessons = await course.getLessons()
        courseJson.lessons = await Promise.all(lessons.map(async lesson => {
          var lessonJson = lesson.toJSON()
          var exercises = await lesson.getExercises()
          lessonJson.exercises = exercises.map(exercise => exercise.toJSON())
          return lessonJson
        }))
        return courseJson
      }))

      console.log(coursesJson)
      res.send({
        courses: coursesJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve courses"
      })
    }
  },

  async listAll (req, res) {
    try {
      let courses = null
      if (req.query.search) {
        courses = await Course.findAll({
          where: {
            [Op.or]: [
              'name', 'instrument'
            ].map(key => {
              return {
                [key] : {
                  [Op.like]: `%${req.query.search}%`
                }
              }
            })
          },
          limit: 12
        })
      } else {
        courses = await Course.findAll({ 
          order: Sequelize.literal('random()'), 
          limit: 12
        })
      }

      if (!courses) {
        return res.status(403).send({
          error: "No course found"
        })
      }
      
      var coursesJson = courses.map(course => {
        return course.toJSON()
      })

      res.send({
        courses: coursesJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve courses"
      })
    }
  },

  async show (req, res) {
    try {
      const {cid} = req.query
      const course = await Course.findOne({
        where : {
          id: cid
        }
      })

      if (!course) {
        return res.status(403).send({
          error: 'No course found'
        })
      }

      var courseJson = course.toJSON()
      var lessons = await course.getLessons()
      courseJson.lessons = await Promise.all(lessons.map(async lesson => {
        var lessonJson = lesson.toJSON()
        var exercises = await lesson.getExercises()
        lessonJson.exercises = exercises.map(exercise => exercise.toJSON())
        return lessonJson
      }))

      console.log(courseJson)
      res.send({
        course: courseJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve course"
      })
    }
  },

  async destroy (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {cid} = req.query
        await Course.destroy({
          where: {
            id: cid
          },
          individualHooks: true
        })
  
        res.send({
          data: 'ok'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete course"
      })
    }
  },

  async edit (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const user = req.user
        if (req.files['previewVideo'] && req.files['previewVideo'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${req.body.name}/previewVideo/${req.files['previewVideo'][0].originalname}`,
              Body: req.files['previewVideo'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.previewVideoUrl = response.Location
        }

        if (req.files['coverPhoto'] && req.files['coverPhoto'].length > 0) {
          let params = {
              Bucket: config.aws.bucket,
              Key: `${user.email}/${req.body.name}/coverPhoto/${req.files['coverPhoto'][0].originalname}`,
              Body: req.files['coverPhoto'][0].buffer
          }
      
          // Uploading files to the bucket
          const response = await s3.upload(params).promise()
          req.body.coverPhotoUrl = response.Location
        } 

        await Course.update(req.body, {
          where: {
            id: req.body.id
          }
        })
  
        const course = await Course.findOne({
          where: {
            id: courseObj.id
          }
        })
  
        res.send({
          course: course.toJSON()
        })
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to edit course"
      })
    }
  }
}