module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    uniqueId: DataTypes.STRING,
    progress: DataTypes.DOUBLE
  })
  
  return Task
}