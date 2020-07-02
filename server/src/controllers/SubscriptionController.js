const {User} = require('../models')
const {Course} = require('../models')

module.exports = {
  async subscribe (req, res) {
    try {
      const {studentId, courseId} = req.body
      console.log('req boy:', req.body)

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

      console.log("student and course found")
      
      if (!student || !course) {
        return res.status(403).send({
          error: "Given information is incorrect"
        })
      }

      // add a tutor to student
      await student.addSubscribedCourse(course)
      console.log(await student.getSubscribedCourses())

      // add the student under tutor
      await course.addStudent(student)
      console.log(await course.getStudents())

      console.log("even got here")

      res.send({data: 'ok'})
    } catch (err) {
      console.log(err)
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

      // var associatedUsers = []
      // if (user.isStudent) {
      //   associatedUsers = await user.getTutors()
      // } else {
      //   associatedUsers = await user.getStudents()
      // }

      // const usersJson = []

      var subscribedCourses = await user.getSubscribedCourses()
      // const arr = [1, 2, 3];

      // const asyncRes = await Promise.all(arr.map(async (i) => {
      //   await sleep(10);
      //   return i + 1;
      // }));
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
      console.log(err)
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

      console.log("course found")
      
      if (!course) {
        return res.status(403).send({
          error: "Course information is incorrect"
        })
      }

      // var associatedUsers = []
      // if (user.isStudent) {
      //   associatedUsers = await user.getTutors()
      // } else {
      //   associatedUsers = await user.getStudents()
      // }

      // const usersJson = []

      const subscribedStudents = await course.getStudents()

      const studentsJson = []
      subscribedStudents.forEach(student => {
        studentsJson.push(student.toJSON())
      })
      // if (user.isStudent) {
      //   res.send({
      //     tutors: usersJson
      //   })
      // } else {
      //   res.send({
      //     students: usersJson
      //   })
      // }
      res.send({
        students: studentsJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve subscription information'
      })
    }
  },

  async getAllTutors (req, res) {
    try {
      var tutors =  await User.findAll({
          where: {
            isTutor: true
          }
      })

      const usersJson = []
      tutors.forEach(associatedUser => {
        usersJson.push(associatedUser.toJSON())
      })

      res.send({
        tutors: usersJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve tutors information'
      })
    }
  },

  async getAllStudents (req, res) {
    try {
      var students =  await User.findAll({
          where: {
            isStudent: true
          }
      })

      const usersJson = []
      students.forEach(associatedUser => {
        usersJson.push(associatedUser.toJSON())
      })

      res.send({
        students: usersJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve students information'
      })
    }
  }
}