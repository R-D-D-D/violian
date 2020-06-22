const {Lesson} = require('../models')
const {User} = require('../models')

module.exports = {
  async create (req, res) {
    try {
      const {tutorId} = req.body
      const user = await User.findOne({
        where: {
          id: tutorId
        }
      })
      
      if (!user) {
        return res.status(403).send({
          error: "User information is incorrect"
        })
      }

      const lesson = await user.createLesson(req.body)
      lesson.setTutor(user)

      res.send(lesson.toJSON())
    } catch (err) {
      res.status(500).send({
        error: 'an  error has occured trying to create the lesson'
      })
    }
  },

  async list (req, res) {
    try {
      console.log("in get")
      const {tutorId} = req.body
      const user = await User.findOne({
        where: {
          id: tutorId
        }
      })
      
      if (!user) {
        return res.status(403).send({
          error: "User information is incorrect"
        })
      }

      console.log("user found")

      var lessons = null
      var tutor = await User.findOne({
        where: {
          id: req.body.tutorId
        }
      })
      lessons = await tutor.getLessons()

      console.log("user1 found")

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

  }
}