module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define('Exercise', {
    name: {
      type: DataTypes.STRING
    },
    melody: {
      type: DataTypes.TEXT
    },
    timeSignature: {
      type: DataTypes.STRING
    },
    numberOfBars: {
      type: DataTypes.INTEGER
    },
    bpm: {
      type: DataTypes.INTEGER
    },
    demoUrl: {
      type: DataTypes.STRING
    },
    demoPosterUrl: {
      type: DataTypes.STRING
    },
    videoUrl: {
      type: DataTypes.STRING
    },
    videoPosterUrl: {
      type: DataTypes.STRING
    }
  })

  Exercise.associate = function (models) {
    Exercise.belongsTo(models.Lesson)
  }
  
  return Exercise
}