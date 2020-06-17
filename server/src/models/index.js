const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
)

fs
  .readdirSync(__dirname)
  .forEach((file) => {
    if (file != 'index.js') {
      console.log(path.join(__dirname, file))
      const model = sequelize.import(path.join(__dirname, file))
      db[model.name] = model
    }
  })  

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db