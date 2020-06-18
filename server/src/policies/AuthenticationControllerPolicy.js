const Joi = require('joi');

module.exports = {
  register (req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      ),
      role: Joi.string()
    }

    const {error, value} = Joi.validate(req.body, schema)

    if (error) {
      // find out which one caused the error
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'You must provide a valid email'
          })
          break
        case 'password':
          res.status(400).send({
            error: `You must provide a password that follow these rules:
              <br>
              1. It must only contain alphabetical characters
              <br>
              2. It must be 8 - 32 characters long`
          })
          break
        case 'role':
          res.status(400).send({
            error: `Please indicate whether you are a student or tutor`
          })
          break
        default:
          res.status(400).send({
            error: 'An unknown error occured'
          })
          break
      }
    } else {
      next()
    }
  } 
}