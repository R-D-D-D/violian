const {Course} = require('../models')
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

      req.body.duration = 0
      const course = await user.createCourse(req.body)
      await course.setTutor(user)

      res.send({
        course: course.toJSON()
      })
    } catch (err) {
      res.status(500).send({
        error: 'an  error has occured trying to create the course'
      })
    }
  },

  async list (req, res) {
    try {
      const {uid} = req.query
      console.log('userId', uid)
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

      var courses = null
      courses = await user.getCourses()

      if (!courses) {
        return res.status(403).send({
          error: "No lesson found"
        })
      }
      
      console.log("lesson found")

      const coursesJson = []
      courses.forEach(course => {
        coursesJson.push(course.toJSON())
      })
      // console.log(lessonsJson)
      res.send({
        courses: coursesJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve courses"
      })
    }
  },

  async destroy (req, res) {
    try {
      const {cid} = req.query
      await Course.destroy({
        where: {
          id: cid
        }
      })

      res.send({
        data: 'ok'
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to delete course"
      })
    }
  },

  async edit (req, res) {
    try {
      const {courseObj} = req.body
      await Course.update({
        name: courseObj.name,
        price: courseObj.price
      }, {
        where: {
          id: courseObj.id
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

    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to edit course"
      })
    }
  }
}