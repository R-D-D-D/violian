'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable('Folders', {
        size: {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0
        },
        path: Sequelize.DataTypes.STRING
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropTable('Folders');
    })
  }
};
