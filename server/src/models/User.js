const Promise = require('bluebird')
const bcrypt = require('bcrypt')

async function hashPassword(user, options) {
  const saltRounds = 10

  if (!user.changed('password')) {
    return
  }
  
  user.password = await bcrypt.hash(user.password, saltRounds) 
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    isTutor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isStudent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeSave: hashPassword
    }
  })

  User.prototype.comparePassword = async function (password) {
    const match = await bcrypt.compare(password, this.password)
    if (match) {
      return true
    } else {
      return false
    }
  }

  return User;
}