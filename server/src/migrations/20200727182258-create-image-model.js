'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable('Images', {
        url: Sequelize.DataTypes.STRING,
        name: Sequelize.DataTypes.STRING,
        size: Sequelize.DataTypes.INTEGER
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropTable('Images');
    })
  }
};
