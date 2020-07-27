module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    size: DataTypes.INTEGER
  })

  Video.associate = function (models) {
    Video.belongsTo(models.Folder)
  }
  
  return Video
}