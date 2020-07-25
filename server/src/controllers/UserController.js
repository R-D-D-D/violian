const {User} = require('../models')

module.exports = {
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
      res.status(500).send({
        error: 'an error has occured trying to retrieve students information'
      })
    }
  },

  async getAllUsers (req, res) {
    try {
      var users =  await User.findAll()

      const usersJson = []
      users.forEach(user => {
        usersJson.push(user.toJSON())
      })

      res.send({
        users: usersJson
      })
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to retrieve users information'
      })
    }
  },
}