module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define('Folder', {
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
    isRoot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    },
    relativePath: DataTypes.STRING
  })

  Folder.associate = function (models) {
    Folder.hasMany(models.File, {
      onDelete: 'CASCADE',
      hooks: true
    })
    Folder.belongsToMany(Folder, { as: 'Children', through: 'ParentChildrenFolders', foreignKey: 'ParentId', onDelete: 'CASCADE', hooks: true}) 
    Folder.belongsToMany(Folder, { as: 'Parents', through: 'ParentChildrenFolders', foreignKey: 'ChildId' }) 
    Folder.belongsTo(models.Lesson)
  }

  Folder.beforeDestroy(async (folder, options) => {
    console.log('in folder before destroy hook')
    await sequelize.transaction(async (t) => {
      let files = folder.getFiles()
      if (files.length > 0) {
        files.map(async file => {
          await file.destroy({
            transaction: t
          })
        })
      }
    })
  })
  
  return Folder
}