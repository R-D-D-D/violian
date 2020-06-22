const {User} = require('../models')
const { TimeoutError } = require('bluebird')

module.exports = {
  async subscribe (req, res) {
    try {
      const {studentId, tutorId} = req.body
      const student = await User.findOne({
        where: {
          id: studentId
        }
      })

      const tutor = await User.findOne({
        where: {
          id: tutorId
        }
      })

      console.log("student tutor found")
      
      if (!student || !tutor) {
        return res.status(403).send({
          error: "User information is incorrect"
        })
      }

      // add a tutor to student
      await student.addTutor(tutor)
      console.log(await student.getTutor())

      // add the student under tutor
      await tutor.addStudent(student)
      console.log(await tutor.getStudent())

      console.log("even got here")

      res.send({data: 'ok'})
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to subscribe'
      })
    } 
  },

  async getStudentSubscriptionInfo (req, res) {
    try {
      const {studentId} = req.body
      const student = await User.findOne({
        where: {
          id: studentId
        }
      })

      console.log("student found")
      
      if (!student) {
        return res.status(403).send({
          error: "Student information is incorrect"
        })
      }

      var tutors = student.getTutor()

      const usersJson = []
      tutors.forEach(student => {
        usersJson.push(student.toJSON())
      })
      res.send({
        tutors: usersJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve student tutor information'
      })
    }
  },

  async getTutorSubscriptionInfo (req, res) {
    try {
      const {tutorId} = req.body
      const tutor = await User.findOne({
        where: {
          id: tutorId
        }
      })

      console.log("auser found")
      
      if (!tutor) {
        return res.status(403).send({
          error: "Tutor information is incorrect"
        })
      }

      var students = user.getStudent()

      console.log("Students found")

      const usersJson = []
      students.forEach(user => {
        usersJson.push(user.toJSON())
      })
      res.send({
        students: usersJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve student tutor information'
      })
    }
  }
}