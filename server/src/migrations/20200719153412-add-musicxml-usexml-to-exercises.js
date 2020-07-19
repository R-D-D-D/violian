'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Exercises', 'useXml', {
          type: Sequelize.DataTypes.BOOLEAN
        }, { transaction: t }),
        queryInterface.addColumn('Exercises', 'musicXmlUrl', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })])
    })
  },

  // down: async (queryInterface, Sequelize) => {
  //   await queryInterface.sequelize.transaction(async t => {
  //     await Promise.all([
  //       queryInterface.removeColumn('Exercises', 'useXml', { transaction: t }),
  //       queryInterface.removeColumn('Exercises', 'musicXmlUrl', { transaction: t })
  //     ])
  //   })
  // },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Exercises', 'useXml', { transaction: t }),
        queryInterface.removeColumn('Exercises', 'musicXmlUrl', { transaction: t })
      ])
    })
  }
};
