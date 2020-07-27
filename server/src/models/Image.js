module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    size: DataTypes.INTEGER
  })

  Image.associate = function (models) {
    Image.belongsTo(models.Folder)
  }
  
  return Image
}