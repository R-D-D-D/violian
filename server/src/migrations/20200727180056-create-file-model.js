'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable('Files', {
        url: Sequelize.DataTypes.STRING,
        name: Sequelize.DataTypes.STRING,
        size: Sequelize.DataTypes.INTEGER,
        type: Sequelize.DataTypes.STRING,
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropTable('Files');
    })
  }
};
