'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropTable('Resources');
    })
  }
};
