module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define('Folder', {
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
  })

  Folder.associate = function (models) {
    Folder.hasMany(models.File)
    Folder.hasMany(models.Video)
    Folder.hasMany(models.Image)
    Folder.belongsToMany(Folder, { as: 'Children', through: 'ParentChildrenFolders', foreignKey: 'ChildId' }) 
    Folder.belongsToMany(Folder, { as: 'Parents', through: 'ParentChildrenFolders', foreignKey: 'ParentId' }) 
  }
  
  return Folder
}