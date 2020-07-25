'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn('Courses', 'coverPhotoUrl', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
    })
  },


  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropColumn('Courses', 'coverPhotoUrl', {
        type: Sequelize.DataTypes.STRING
      }, { transaction: t })
    })
  }
};
