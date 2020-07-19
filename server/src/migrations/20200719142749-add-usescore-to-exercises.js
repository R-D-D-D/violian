'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn('Exercises', 'useScore', {
        type: Sequelize.DataTypes.BOOLEAN,
      }, { transaction: t })
    })
  },

  // down: async (queryInterface, Sequelize) => {
  //   await queryInterface.sequelize.transaction(async t => {
  //     await queryInterface.removeColumn('Exercises', 'useScore', { transaction: t })
  //   })
  // },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('Exercises', 'useScore', { transaction: t })
    })
  }
};
