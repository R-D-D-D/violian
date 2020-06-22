module.exports = (sequelize, DataTypes) => {
  const StudentTutors = sequelize.define('StudentTutors', {
  }, {
    freezeTableName: true
  })

  StudentTutors.associate = function(models) {
    StudentTutors.belongsTo(models.User, { as: 'Student', onDelete: 'CASCADE'})
    StudentTutors.belongsTo(models.User, { as: 'Tutor', onDelete: 'CASCADE' })
  }

  return StudentTutors
};