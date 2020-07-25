const {Lesson} = require('../models')
const {User} = require('../models')
const {Course} = require('../models')
const {sequelize} = require('../models')

module.exports = {
  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {cid} = req.body
        console.log(req.body)

        const course = await Course.findOne({
          where: {
            id: cid
          }
        })
        
        if (!course) {
          return res.status(403).send({
            error: "Course information is incorrect"
          })
        }
  
        const lesson = await course.createLesson(req.body)
  
        await course.increment('duration', { by: parseInt(req.body.duration) || 0})
        await lesson.setCourse(course)
  
        res.send({
          lesson: lesson.toJSON()
        })
      })
    } catch (err) {
      console.log('from lesson', err)
      res.status(500).send({
        error: 'an error has occured trying to create the lesson'
      })
    }
  },

  async edit (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {lessonObj} = req.body
        const lesson = await Lesson.findOne({
          where: {
            id: lessonObj.id
          }
        })

        if (!lesson) {
          res.status(403).send({
            error: "Lesson not found"
          })
        }

        const course = await lesson.getCourse()
        var differenceInDuration = parseInt(lessonObj.duration) - lesson.duration
        if (differenceInDuration != 0) {
          if (differenceInDuration > 0) {
            await course.increment('duration', { by: differenceInDuration })
          } else {
            await course.decrement('duration', { by: differenceInDuration })
          }
        }

        lesson.name = lessonObj.name
        lesson.duration = lessonObj.duration
        await lesson.save()

        res.send({
          lesson: lesson.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to edit lesson"
      })
    }
  },

  async list (req, res) {
    try {
      const {cid} = req.query

      const course = await Course.findOne({
        where: {
          id: cid
        }
      })
      
      if (!course) {
        return res.status(403).send({
          error: "Course information is incorrect"
        })
      }

      var lessons = await course.getLessons()

      if (!lessons) {
        return res.status(403).send({
          error: "No lesson found"
        })
      }
      
      const lessonsJson = []
      lessons.forEach(lesson => {
        lessonsJson.push(lesson.toJSON())
      })
      res.send({
        lessons: lessonsJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve lessons"
      })
    }
  },

  async destroy (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {lid} = req.query
        const lesson = await Lesson.findOne({
          where: {
            id: lid
          }
        })

        const course = await lesson.getCourse()
        await course.decrement('duration', { by: lesson.duration })
        await lesson.destroy()
        res.send({
          data: 'ok'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete lesson"
      })
    }
  }
}