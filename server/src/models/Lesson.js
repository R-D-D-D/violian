module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    name: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.TEXT
    }
  })

  Lesson.associate = function (models) {
    Lesson.belongsTo(models.Course)
    Lesson.hasMany(models.Exercise, {
      onDelete: 'CASCADE',
      hooks: true
    })
    // Lesson.hasMany(models.Exercise)
    Lesson.hasMany(models.Thread, {
      onDelete: 'CASCADE',
      hooks: true
    })
    Lesson.hasOne(models.Folder, {
      onDelete: 'CASCADE',
      hooks: true
    })
  }

  Lesson.beforeDestroy(async (folder, options) => {
    console.log('in lesson before destroy hook')
  })
  
  return Lesson
}