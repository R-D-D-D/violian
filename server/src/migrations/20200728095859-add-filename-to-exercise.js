'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Exercises', 'videoFilename', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Exercises', 'videoPosterFilename', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Exercises', 'demoFilename', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Exercises', 'demoPosterFilename', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Exercises', 'videoFilename', { transaction: t }),
        queryInterface.removeColumn('Exercises', 'videoPosterFilename', { transaction: t }),
        queryInterface.removeColumn('Exercises', 'demoFilename', { transaction: t }),
        queryInterface.removeColumn('Exercises', 'demoPosterFilename', { transaction: t })
      ]);
    })
  }
};
