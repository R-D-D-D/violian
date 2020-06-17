const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    try {
      const user = await User.create(req.body)
      console.log('in register, user password: ', user.password)
      res.send(user.toJSON())
    } catch (err) {
      res.status(400).send({
        error: "This email account is already in use"
      })
    }
  },

  async login (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        return res.status(403).send({
          error: "Log in information is incorrect"
        })
      }

      console.log("user", user)
      const passwordValid = await user.comparePassword(password)
      if (!passwordValid) {
        console.log("password validity: ", passwordValid)
        return res.status(403).send({
          error: "Log in information is incorrect"
        })
      }

      const userJson = user.toJSON();
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to log in"
      })
    }
  }
}