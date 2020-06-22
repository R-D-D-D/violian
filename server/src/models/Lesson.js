module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
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

  Lesson.associate = function (models) {
    Lesson.belongsTo(models.User, { as: 'Tutor' })
  }
  
  return Lesson
}