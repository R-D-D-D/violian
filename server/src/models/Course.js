module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.DOUBLE
    }
  })

  Course.associate = function (models) {
    Course.belongsToMany(models.User, { as: 'Students', through: 'StudentCourses' })
    Course.belongsTo(models.User, { as: 'Tutor' })
    Course.hasMany(models.Lesson, {
      onDelete: 'CASCADE'
    })
  }
  
  return Course
}