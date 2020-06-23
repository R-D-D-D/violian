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
      // console.log(await student.getTutors())

      // add the student under tutor
      await tutor.addStudent(student)
      // console.log(await tutor.getStudents())

      // console.log("even got here")

      res.send({data: 'ok'})
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to subscribe'
      })
    } 
  },

  async getSubscriptionInfo (req, res) {
    try {
      var user =  await User.findOne({
          where: {
            id: req.query.uid
          }
      })

      console.log("user found")
      
      if (!user) {
        return res.status(403).send({
          error: "User information is incorrect"
        })
      }

      var associatedUsers = []
      if (user.isStudent) {
        associatedUsers = await user.getTutors()
      } else {
        associatedUsers = await user.getStudents()
      }

      const usersJson = []
      associatedUsers.forEach(associatedUser => {
        usersJson.push(associatedUser.toJSON())
      })
      if (user.isStudent) {
        res.send({
          tutors: usersJson
        })
      } else {
        res.send({
          students: usersJson
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve student tutor information'
      })
    }
  }
}