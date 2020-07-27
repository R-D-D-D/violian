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
      if (req.body.role == 'Tutor') {
        req.body['isTutor'] = true
        req.body['isStudent'] = false
      } else {
        req.body['isStudent'] = true
        req.body['isTutor'] = false
      }
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isTutor: req.body['isTutor'],
        isStudent: req.body['isStudent']
      })
      const userJson = user.toJSON();
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
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

      const passwordValid = await user.comparePassword(password)
      if (!passwordValid) {
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
  },

  async adminLogin (req, res) {
    try {
      const {email} = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user || req.user.email != 'wangrunding@gmail.com') {
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
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to log in"
      })
    }
  }
}