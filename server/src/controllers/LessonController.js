const {Lesson} = require('../models')
const {User} = require('../models')

module.exports = {
  async create (req, res) {
    try {
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

      const lesson = await user.createLesson(req.body)
      lesson.setTutor(user)

      res.send({
        lesson: lesson.toJSON()
      })
    } catch (err) {
      res.status(500).send({
        error: 'an  error has occured trying to create the lesson'
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

      var lessons = null
      lessons = await user.getLessons()

      if (!lessons) {
        return res.status(403).send({
          error: "No lesson found"
        })
      }
      
      console.log("lesson found")

      const lessonsJson = []
      lessons.forEach(lesson => {
        lessonsJson.push(lesson.toJSON())
      })
      // console.log(lessonsJson)
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
      const {lid} = req.query
      await Lesson.destroy({
        where: {
          id: lid
        }
      })

      res.send({
        data: 'ok'
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete lesson"
      })
    }
  },

  async edit (req, res) {
    try {
      const {lessonObj} = req.body
      await Lesson.update({
        date: lessonObj.date,
        name: lessonObj.name,
        rhythms: lessonObj.rhythms
      }, {
        where: {
          id: lessonObj.id
        }
      })

      const lesson = await Lesson.findOne({
        where: {
          id: lessonObj.id
        }
      })

      console.log(lesson.toJSON())
      res.send({
        lesson: lesson.toJSON()
      })

    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete lesson"
      })
    }
  }
}