const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const Umzug = require('umzug');
const config = require('../config/config')
const db = {}

var sequelize = null

if (process.env.ENV == 'development') {
  sequelize = new Sequelize({
    dialect: config.db.dialect, 
    storage: config.db.url
  })
} else {
  sequelize = new Sequelize(config.db.url)
}

fs
  .readdirSync(__dirname)
  .forEach((file) => {
    if (file != 'index.js') {
      const model = require(path.join(__dirname, file))(sequelize, DataTypes)
      db[model.name] = model
    }
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, '..', 'migrations'),
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ]
  }
});

(async () => {
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  await umzug.up()
  // await umzug.down({ to: 0 })
})();

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
