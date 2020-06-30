module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATEONLY
    },
    rhythms: {
      type: DataTypes.TEXT
    }
  })

  Course.associate = function (models) {
    Course.belongsTo(models.User, { as: 'Tutor' })
  }
  
  return Course
}