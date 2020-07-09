module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define('Thread', {
  })

  Thread.associate = function (models) {
    Thread.belongsTo(models.Exercise)
    Thread.belongsTo(models.User)
    Thread.hasMany(models.Post, {
      onDelete: 'CASCADE',
      hooks: true
    })
  }
  
  return Thread
}