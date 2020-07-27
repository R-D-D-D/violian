module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    size: DataTypes.INTEGER,
    type: DataTypes.STRING
  })

  File.associate = function (models) {
    File.belongsTo(models.Folder)
  }
  
  return File
}