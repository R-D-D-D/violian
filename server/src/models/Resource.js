module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    url: DataTypes.STRING,
    fileName: DataTypes.TEXT,
    fileSize: DataTypes.DOUBLE
  })

  Resource.associate = function (models) {
    Resource.belongsTo(models.Lesson)
  }
  
  return Resource
}