module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define('Folder', {
    size: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    path: DataTypes.STRING
  })

  Folder.associate = function (models) {
    Folder.hasMany(models.File, {
      onDelete: 'CASCADE',
      hooks: true
    })
    // Folder.belongsToMany(Folder, { as: 'Children', through: 'ParentChildrenFolders', foreignKey: 'ParentId', onDelete: 'CASCADE', hooks: true}) 
    // Folder.belongsToMany(Folder, { as: 'Parents', through: 'ParentChildrenFolders', foreignKey: 'ChildId' }) 
    Folder.belongsTo(models.Lesson)

    Folder.beforeDestroy(async (folder, options) => {
      console.log('in folder before destroy hook')
      await sequelize.transaction(async (t) => {
        await models.File.destroy({
          where: {
            FolderId: folder.id
          },
          transaction: t,
          individualHooks: true
        })
      })
    })
  }
  
  return Folder
}