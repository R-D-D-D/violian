const {User} = require('../models')
const {Course} = require('../models')

module.exports = {
  async subscribe (req, res) {
    try {
      const {studentId, courseId} = req.body

      const student = await User.findOne({
        where: {
          id: studentId
        }
      })

      const course = await Course.findOne({
        where: {
          id: courseId
        }
      })
      
      if (!student || !course) {
        return res.status(403).send({
          error: "Given information is incorrect"
        })
      }

      // add a tutor to student
      await student.addSubscribedCourse(course)

      // add the student under tutor
      await course.addStudent(student)

      res.send({data: 'ok'})
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to subscribe'
      })
    } 
  },

  async getSubscriptionInfoOfStudent (req, res) {
    try {
      var user =  await User.findOne({
          where: {
            id: req.query.uid
          }
      })
      
      if (!user || !user.isStudent) {
        return res.status(403).send({
          error: "User information is incorrect"
        })
      }

      var subscribedCourses = await user.getSubscribedCourses()
      var coursesJson = []

      coursesJson = await Promise.all(subscribedCourses.map(async course => {
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

      res.send({
        courses: coursesJson
      })
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to retrieve subscription information'
      })
    }
  },

  async getSubscriptionInfoOfCourse (req, res) {
    try {
      var course =  await Course.findOne({
          where: {
            id: req.query.cid
          }
      })
      
      if (!course) {
        return res.status(403).send({
          error: "Course information is incorrect"
        })
      }

      const subscribedStudents = await course.getStudents()

      const studentsJson = []
      subscribedStudents.forEach(student => {
        studentsJson.push(student.toJSON())
      })

      res.send({
        students: studentsJson
      })
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to retrieve subscription information'
      })
    }
  },

  async isSubscribed (req, res) {
    try {
      let user = req.user
      let courses = await user.getSubscribedCourses()
      let course = courses.find(course => course.id == req.query.cid)
      if (course != undefined) {
        return res.json({
          isSubscribed: true
        })
      } else {
        return res.json({
          isSubscribed: false
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve subscription information'
      })
    }
  },

  async isOwned (req, res) {
    try {
      let user = req.user
      let courses = await user.getCourses()
      let course = courses.find(course => course.id == req.query.cid)
      if (course != undefined) {
        return res.json({
          isOwned: true
        })
      } else {
        return res.json({
          isOwned: false
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve subscription information'
      })
    }
  }
}