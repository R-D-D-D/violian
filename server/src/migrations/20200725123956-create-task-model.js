'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable('Tasks', {
        uniqueId: Sequelize.DataTypes.STRING,
        progress: Sequelize.DataTypes.DOUBLE
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropTable('Tasks');
    })
  }
};
