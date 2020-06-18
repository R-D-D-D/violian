module.exports = (sequelize, DataTypes) => {
  const RhythmPattern = sequelize.define('RhythmPattern', {})

  // RhythmPattern.associate = function (models) {
  //   RhythmPattern.belongsTo(models.User)
  // }
  return RhythmPattern;
}